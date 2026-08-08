#!/usr/bin/env bash
#
# Installs the admin panel on the VPS. Idempotent: re-run it after any change
# under deploy/admin/.
#
#   scp -P 2007 -r deploy/admin ubuntu@164.132.99.194:/home/ubuntu/
#   ssh -p 2007 ubuntu@164.132.99.194 'sudo bash /home/ubuntu/admin/install.sh'
#
# This is a separate step from the deploy on purpose: the GitHub workflow only
# rsyncs PythonDCA/, so nothing under deploy/ ever reaches the box by itself.
#
# Installs:
#   vallee-panel   four-pane panel (journal, accounts, gallery, disk)
#   vallee-users   the accounts, newest first, in a pager
#   vallee-space   what the gallery weighs and what is left
#
# The three are deliberately the same set emoji-art has as ea-panel / ea-users /
# ea-space: one box, two sites, and no reason to learn two habits.
set -euo pipefail

[ "$(id -u)" -eq 0 ] || { echo "à lancer avec sudo"; exit 1; }
SRC="$(cd "$(dirname "$0")" && pwd)"
BIN=/usr/local/bin
LIB=/usr/local/lib/vallee-panel

command -v python3 >/dev/null || apt-get install -y python3
command -v sqlite3 >/dev/null || apt-get install -y sqlite3

for cmd in vallee-panel vallee-users vallee-space; do
  install -m 0755 "$SRC/$cmd" "$BIN/$cmd"
  echo "  ✓ $BIN/$cmd"
done

# The site was called Picture to DMC until August 2026. Leaving `ptd-panel` on
# the box would leave two commands doing one job, one of them pointed at a
# library this script is about to delete.
for old in ptd-panel ptd-users ptd-space; do
  if [ -e "$BIN/$old" ]; then
    rm -f "$BIN/$old"
    echo "  ✓ retiré $BIN/$old (ancien nom)"
  fi
done
rm -rf /usr/local/lib/ptd-panel

# The panel is a Python package: replace the directory wholesale so a module
# deleted between two versions does not linger and get imported.
rm -rf "$LIB"
install -d -m 0755 "$LIB"
install -m 0644 "$SRC"/panel/*.py "$LIB/"
echo "  ✓ $LIB ($(ls -1 "$LIB" | tr '\n' ' '))"

python3 -m compileall -q "$LIB" >/dev/null && echo "  ✓ compilation Python OK"
echo ""
echo "Prêt : sudo ptd-panel"
