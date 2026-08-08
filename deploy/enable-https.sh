#!/usr/bin/env bash
#
# Put La Vallée des Points de Croix behind HTTPS. Run as root, idempotent.
#
#   sudo bash deploy/enable-https.sh vallee-points-de-croix.fr
#   sudo bash deploy/enable-https.sh vallee-points-de-croix.fr www.vallee-points-de-croix.fr
#   CERTBOT_EMAIL=moi@exemple.fr sudo -E bash deploy/enable-https.sh <canonique> [alias...]
#
# The FIRST name is canonical: it is what the site is served on. Every other name
# given goes on the same certificate and is then redirected to it with a 301. Two
# names serving the same pages is duplicate content, and only one of them can be
# what the sitemap, the canonical tags and the Open Graph tags say the site is.
#
# Every name must already resolve here. An alias that does not is worse than no
# alias: certbot asks for ONE certificate covering all of them, so a single
# unreachable name fails the whole request — including for the canonical name that
# was working a minute ago. This script refuses to try in that case.
#
# Certificates are obtained with the *webroot* plugin rather than --nginx: the
# nginx installer rewrites whichever config it finds, and the only port-80
# block on this box belongs to emoji-art. Webroot touches nothing but its own
# challenge directory.
set -euo pipefail

HOST="${1:-}"
shift || true
ALIASES=("$@")
EMAIL="${CERTBOT_EMAIL:-}"
SRC="$(cd "$(dirname "$0")" && pwd)"
WEBROOT=/var/www/certbot
SITE=/etc/nginx/sites-available/picturetodmc

[ "$(id -u)" -eq 0 ] || { echo "run me with sudo"; exit 1; }
[ -n "$HOST" ] || { echo "usage: $0 <canonical-host> [alias...]"; exit 1; }

ALL=("$HOST" ${ALIASES[@]+"${ALIASES[@]}"})

say() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }

say "Checking that every name points here"
mine="$(curl -fsS --max-time 5 https://api.ipify.org || true)"
echo "  this server -> ${mine:-unknown}"
bad=0
for name in "${ALL[@]}"; do
    resolved="$(getent ahostsv4 "$name" | awk '{print $1}' | head -1 || true)"
    echo "  $name -> ${resolved:-unresolved}"
    if [ -z "$resolved" ]; then
        bad=1
    elif [ -n "$mine" ] && [ "$resolved" != "$mine" ]; then
        bad=1
    fi
done
if [ "$bad" -ne 0 ]; then
    echo "  at least one name does not point here. Let's Encrypt would refuse the" >&2
    echo "  whole certificate, canonical name included. Fix DNS first." >&2
    exit 1
fi

say "Challenge webroot"
install -d -m 755 "$WEBROOT/.well-known/acme-challenge"
echo ok > "$WEBROOT/.well-known/acme-challenge/ping"

# The certificate is (re)requested when there is none, and also when the set of
# names has changed. Only checking for absence would quietly leave a newly added
# alias uncovered: the file exists, so the script would skip straight to writing
# an nginx config that references a name the certificate does not carry.
wanted="$(printf '%s\n' "${ALL[@]}" | sort | tr '\n' ' ')"
# The `|| true` is load-bearing, and not for the reason it looks like.
#
# `grep` exits 1 when it matches nothing, and this script runs with `pipefail`, so
# that 1 becomes the exit status of the whole pipeline, then of the assignment,
# and `set -e` kills the script. It happens on exactly one run: the first, when no
# certificate exists yet and there is nothing for grep to find — which is the run
# that most needed to work.
covered="$( { certbot certificates --cert-name "$HOST" 2>/dev/null \
    | awk -F'Domains:' '/Domains:/{print $2}' | tr -s ' ' '\n' | grep -v '^$' | sort | tr '\n' ' '; } || true )"

if [ ! -s "/etc/letsencrypt/live/$HOST/fullchain.pem" ] || [ "$covered" != "$wanted" ]; then
    # `if`, not `[ ... ] && [ ... ] && echo`. Under `set -e`, a bare && chain used
    # as a statement aborts the script the moment its first test is false — and
    # the very first run, when no certificate exists and $covered is empty, is
    # exactly that case. It killed this script here once already.
    if [ -n "$covered" ]; then
        echo "  names change: [$covered] -> [$wanted]"
    fi

    # certbot needs port 80 answering for every name *before* the certificate
    # exists, but the final config references certificate files that are not there
    # yet. So: serve a bare http block first, get the certificate, then install the
    # real config.
    say "Temporary http-only vhost"
    cat > "$SITE" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${ALL[*]};
    location ^~ /.well-known/acme-challenge/ {
        root $WEBROOT;
        default_type "text/plain";
    }
    location / { return 503; }
}
EOF
    ln -sfn "$SITE" /etc/nginx/sites-enabled/picturetodmc
    nginx -t && systemctl reload nginx
    for name in "${ALL[@]}"; do
        # Informational, and explicitly non-fatal for the same `set -e` reason:
        # certbot is about to attempt the same fetch and will explain a failure
        # far better than a silently aborted script would.
        if curl -fsS "http://$name/.well-known/acme-challenge/ping" >/dev/null 2>&1; then
            echo "  challenge path reachable for $name"
        else
            echo "  WARNING: challenge path NOT reachable for $name"
        fi
    done

    say "Requesting the certificate for ${ALL[*]}"
    domains=()
    for name in "${ALL[@]}"; do domains+=(-d "$name"); done
    # --cert-name pins the lineage to the canonical name, so adding or removing an
    # alias updates this certificate instead of starting a second one beside it.
    certbot certonly --webroot -w "$WEBROOT" "${domains[@]}" \
        --cert-name "$HOST" --expand \
        --non-interactive --agree-tos \
        $([ -n "$EMAIL" ] && echo "--email $EMAIL" || echo "--register-unsafely-without-email") \
        --keep-until-expiring
else
    say "Certificate already covers ${ALL[*]} — reusing it"
fi

say "Installing the real config"
install -d -m 755 /etc/nginx/snippets
install -m 644 "$SRC/nginx-picturetodmc-proxy.conf" /etc/nginx/snippets/picturetodmc-proxy.conf

# One 443 block per alias, doing nothing but redirecting.
#
# That it needs the certificate at all is the part that surprises people: a
# browser asking for https://alias completes the TLS handshake BEFORE it is told
# to go elsewhere, so there has to be a valid certificate for the name being left
# behind. A redirect cannot rescue a certificate warning.
alias_block=""
for name in ${ALIASES[@]+"${ALIASES[@]}"}; do
    alias_block+="server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name $name;

    ssl_certificate     /etc/letsencrypt/live/$HOST/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$HOST/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://$HOST\$request_uri;
}

"
done

awk -v block="$alias_block" '$0 == "__ALIAS_BLOCK__" { printf "%s", block; next } { print }' \
    "$SRC/nginx-picturetodmc.conf" \
    | sed -e "s/__SERVER_NAMES__/${ALL[*]}/g" -e "s/__HOST__/$HOST/g" > "$SITE"

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
if systemctl is-active --quiet certbot.timer; then
    echo "  certbot.timer active"
else
    echo "  WARNING: certbot.timer is not active — nothing renews this certificate"
fi
certbot renew --dry-run --cert-name "$HOST" 2>&1 | tail -3

say "Done"
echo "  https://$HOST"
for name in ${ALIASES[@]+"${ALIASES[@]}"}; do echo "  https://$name -> 301"; done
echo
echo "  Next, and none of it is optional:"
echo "    1. PUBLIC_ORIGIN=https://$HOST in /etc/picturetodmc.env, then"
echo "       systemctl restart picturetodmc  (the Google callback URL is built from it)"
echo "    2. add https://$HOST/api/auth/google/callback to the Google Cloud console,"
echo "       or sign-in answers redirect_uri_mismatch"
echo "    3. ORIGIN in frontend/src/lib/site.ts, then rebuild and deploy — the"
echo "       sitemap, the canonicals and the share cards still name the old host"
