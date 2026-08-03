#!/usr/bin/env bash
#
# Install Picture to DMC on the VPS. Run once, as root. Idempotent — safe to
# re-run after changing anything under deploy/.
#
#   scp -P 2007 -r deploy ci_key.pub ubuntu@164.132.99.194:/home/ubuntu/
#   ssh -p 2007 ubuntu@164.132.99.194 \
#       'sudo bash /home/ubuntu/deploy/setup-vps.sh /home/ubuntu/ci_key.pub'
#
# What it sets up:
#   /var/www/picturetodmc/app     code + built frontend (rsynced by CI)
#   /var/www/picturetodmc/venv    Python 3.13 virtualenv
#   picturetodmc.service          uvicorn on 127.0.0.1:8001
#   nginx :8080                   public entry point, proxies to the above
#
# This box also runs emoji-art on 80/443. Nothing here touches it.
set -euo pipefail

APP=picturetodmc
APP_ROOT=/var/www/$APP
APP_DIR=$APP_ROOT/app
VENV=$APP_ROOT/venv
PY_VERSION=3.13
DEPLOY_USER=deploy
PUBLIC_PORT=8080

CI_KEY="${1:-}"
SRC="$(cd "$(dirname "$0")" && pwd)"

[ "$(id -u)" -eq 0 ] || { echo "run me with sudo"; exit 1; }

say() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }

say "Packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq nginx rsync curl ca-certificates >/dev/null
echo "  nginx, rsync, curl present"

say "Deploy user"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
    adduser --system --group --shell /bin/bash --home "/home/$DEPLOY_USER" "$DEPLOY_USER"
    echo "  created $DEPLOY_USER"
else
    echo "  $DEPLOY_USER already exists (shared with emoji-art)"
fi

if [ -n "$CI_KEY" ]; then
    install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
    touch "/home/$DEPLOY_USER/.ssh/authorized_keys"
    # Append only if absent, so re-running doesn't duplicate the key and the
    # emoji-art key already in there is left alone.
    if ! grep -qxF "$(cat "$CI_KEY")" "/home/$DEPLOY_USER/.ssh/authorized_keys"; then
        cat "$CI_KEY" >> "/home/$DEPLOY_USER/.ssh/authorized_keys"
        echo "  CI public key added"
    else
        echo "  CI public key already authorised"
    fi
    chown "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh/authorized_keys"
    chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"
fi

say "Python $PY_VERSION via uv"
# Ubuntu 26.04 ships only Python 3.14, which has no wheels for the versions
# this project pins (pillow 11.3.0 in particular). uv fetches a standalone
# 3.13 into /opt — the system interpreter is never touched.
export UV_INSTALL_DIR=/usr/local/bin
export UV_PYTHON_INSTALL_DIR=/opt/uv-python
if ! command -v uv >/dev/null; then
    curl -LsSf https://astral.sh/uv/install.sh | env UV_INSTALL_DIR=/usr/local/bin sh >/dev/null
fi
echo "  uv $(uv --version | awk '{print $2}')"

install -d -m 755 "$UV_PYTHON_INSTALL_DIR"
uv python install "$PY_VERSION"
chmod -R a+rX "$UV_PYTHON_INSTALL_DIR"
echo "  python $PY_VERSION ready in $UV_PYTHON_INSTALL_DIR"

say "Application directories"
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" -m 755 "$APP_ROOT" "$APP_DIR"
if [ ! -x "$VENV/bin/python" ]; then
    uv venv --python "$PY_VERSION" "$VENV"
    echo "  virtualenv created"
else
    echo "  virtualenv already present"
fi
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$APP_ROOT"
echo "  $APP_ROOT owned by $DEPLOY_USER"

say "Database directory"
# The SQLite file lives outside /var/www so a deploy's rsync --delete can never
# reach it.
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" -m 750 /var/lib/$APP
echo "  /var/lib/$APP ready"

if [ ! -s /etc/$APP.env ]; then
    cat > /etc/$APP.env <<'ENVEOF'
# Fill these in, then: systemctl restart picturetodmc
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
PUBLIC_ORIGIN=https://164-132-99-194.sslip.io
ENVEOF
    chown root:"$DEPLOY_USER" /etc/$APP.env
    chmod 640 /etc/$APP.env
    echo "  /etc/$APP.env created — add the Google credentials"
else
    echo "  /etc/$APP.env already present, left alone"
fi

say "systemd service"
install -m 644 "$SRC/$APP.service" "/etc/systemd/system/$APP.service"
systemctl daemon-reload
systemctl enable "$APP" >/dev/null 2>&1
echo "  $APP.service installed and enabled"

say "sudo rule for the CI"
# Exactly one command, no password — the CI restarts the service and nothing else.
printf '%s ALL=(root) NOPASSWD: /usr/bin/systemctl restart %s\n' "$DEPLOY_USER" "$APP" \
    > "/etc/sudoers.d/$APP-deploy"
chmod 440 "/etc/sudoers.d/$APP-deploy"
visudo -cf "/etc/sudoers.d/$APP-deploy" >/dev/null
echo "  /etc/sudoers.d/$APP-deploy validated"

say "nginx"
install -m 644 "$SRC/nginx-$APP.conf" "/etc/nginx/sites-available/$APP"
ln -sfn "/etc/nginx/sites-available/$APP" "/etc/nginx/sites-enabled/$APP"
nginx -t
systemctl reload nginx
echo "  nginx serving port $PUBLIC_PORT"

say "Done"
cat <<MSG
  Code goes to : $APP_DIR   (rsynced by .github/workflows/deploy.yml)
  Service      : systemctl status $APP
  Logs         : journalctl -u $APP -f
  Public URL   : http://$(curl -fsS --max-time 5 ifconfig.me 2>/dev/null || echo YOUR_IP):$PUBLIC_PORT

  The service will not start until the CI has pushed the code and installed
  the dependencies. Trigger it with: gh workflow run Deploy
MSG
