#!/usr/bin/env bash
#
# Put Picture to DMC behind HTTPS. Run as root, idempotent.
#
#   sudo bash deploy/enable-https.sh 164-132-99-194.sslip.io
#   sudo bash deploy/enable-https.sh picturetodmc.fr        # once you have one
#
# The hostname must already resolve to this server — that is the whole point
# of sslip.io in the meantime: 164-132-99-194.sslip.io answers 164.132.99.194
# with no DNS account and no purchase, and it is a real name, so Let's Encrypt
# will sign it.
#
# Certificates are obtained with the *webroot* plugin rather than --nginx: the
# nginx installer rewrites whichever config it finds, and the only port-80
# block on this box belongs to emoji-art. Webroot touches nothing but its own
# challenge directory.
set -euo pipefail

HOST="${1:-}"
EMAIL="${2:-}"
SRC="$(cd "$(dirname "$0")" && pwd)"
WEBROOT=/var/www/certbot
SITE=/etc/nginx/sites-available/picturetodmc

[ "$(id -u)" -eq 0 ] || { echo "run me with sudo"; exit 1; }
[ -n "$HOST" ] || { echo "usage: $0 <hostname> [email]"; exit 1; }

say() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }

say "Checking that $HOST points here"
resolved="$(getent hosts "$HOST" | awk '{print $1}' | head -1 || true)"
mine="$(curl -fsS --max-time 5 https://api.ipify.org || true)"
echo "  $HOST -> ${resolved:-unresolved}"
echo "  this server -> ${mine:-unknown}"
if [ -n "$resolved" ] && [ -n "$mine" ] && [ "$resolved" != "$mine" ]; then
    echo "  they disagree; Let's Encrypt will fail. Fix DNS first." >&2
    exit 1
fi

say "Challenge webroot"
install -d -m 755 "$WEBROOT/.well-known/acme-challenge"
echo ok > "$WEBROOT/.well-known/acme-challenge/ping"

# certbot needs port 80 answering for $HOST *before* the certificate exists,
# but the final config references certificate files that are not there yet.
# So: serve a bare http block first, get the certificate, then install the
# real config.
if [ ! -s "/etc/letsencrypt/live/$HOST/fullchain.pem" ]; then
    say "Temporary http-only vhost"
    cat > "$SITE" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $HOST;
    location ^~ /.well-known/acme-challenge/ {
        root $WEBROOT;
        default_type "text/plain";
    }
    location / { return 503; }
}
EOF
    ln -sfn "$SITE" /etc/nginx/sites-enabled/picturetodmc
    nginx -t && systemctl reload nginx
    curl -fsS "http://$HOST/.well-known/acme-challenge/ping" >/dev/null \
        && echo "  challenge path reachable from outside"

    say "Requesting the certificate"
    certbot certonly --webroot -w "$WEBROOT" -d "$HOST" \
        --non-interactive --agree-tos \
        $([ -n "$EMAIL" ] && echo "--email $EMAIL" || echo "--register-unsafely-without-email") \
        --keep-until-expiring
else
    say "Certificate already present for $HOST — reusing it"
fi

say "Installing the real config"
install -d -m 755 /etc/nginx/snippets
install -m 644 "$SRC/nginx-picturetodmc-proxy.conf" /etc/nginx/snippets/picturetodmc-proxy.conf
sed "s/__HOST__/$HOST/g" "$SRC/nginx-picturetodmc.conf" > "$SITE"
ln -sfn "$SITE" /etc/nginx/sites-enabled/picturetodmc
nginx -t
systemctl reload nginx

say "Renewal"
# The packaged certbot.timer renews everything; it just needs to reload nginx
# afterwards so the new certificate is actually picked up.
install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'EOF'
#!/bin/sh
systemctl reload nginx
EOF
chmod 755 /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
systemctl is-active --quiet certbot.timer && echo "  certbot.timer active"
certbot renew --dry-run --cert-name "$HOST" 2>&1 | tail -3

say "Done"
echo "  https://$HOST"
