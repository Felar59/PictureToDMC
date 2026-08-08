"""Keep the server's list of picture marks in step with the ones that exist.

Three things have to agree: the PNGs in `frontend/public/marks`, the groups in
`frontend/src/components/brand/marks.ts` — which is the source of truth, because
only a person can say whether a picture is a flower or an animal — and the
allow-list the API validates against.

They drift silently in both directions. A slug listed but not shipped is a member
choosing a mark that 404s on every page they appear on; a file shipped but not
listed is a picture nobody can pick. Neither breaks a build, so this fails loudly
instead.

    .venv/Scripts/python.exe scripts/export-marks.py          # check and rewrite
    .venv/Scripts/python.exe scripts/export-marks.py --check   # check only
"""

import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARKS_DIR = os.path.join(ROOT, "frontend", "public", "marks")
MANIFEST = os.path.join(ROOT, "frontend", "src", "components", "brand", "marks.ts")
API = os.path.join(ROOT, "PythonDCA", "api", "routes_auth.py")

sys.stdout.reconfigure(encoding="utf-8")


def on_disk() -> set[str]:
    return {f[:-4] for f in os.listdir(MARKS_DIR) if f.endswith(".png")}


def in_manifest() -> list[str]:
    """The slugs in MARK_GROUPS, in the order a person put them."""
    src = io.open(MANIFEST, encoding="utf-8").read()
    block = re.search(r"export const MARK_GROUPS = \{(.*?)\n\} as const", src, re.S)
    if not block:
        raise SystemExit("MARK_GROUPS not found in marks.ts")
    return re.findall(r'"([a-z0-9-]+)"', block.group(1))


def main() -> int:
    check_only = "--check" in sys.argv
    disk = on_disk()
    listed = in_manifest()

    missing = [s for s in listed if s not in disk]
    unlisted = sorted(disk - set(listed))
    dupes = sorted({s for s in listed if listed.count(s) > 1})

    for slug in missing:
        print(f"LISTED BUT NOT SHIPPED: {slug} — marks.ts offers a mark with no file")
    for slug in unlisted:
        print(f"SHIPPED BUT NOT LISTED: {slug} — the file exists and nobody can pick it")
    for slug in dupes:
        print(f"LISTED TWICE: {slug}")
    if missing or dupes:
        return 1

    table = ",\n".join(f'    "{s}"' for s in listed)
    block = f'MARK_SLUGS = {{\n{table},\n}}'
    src = io.open(API, encoding="utf-8").read()
    current = re.search(r"MARK_SLUGS = \{.*?\n\}", src, re.S)
    if not current:
        raise SystemExit("MARK_SLUGS not found in routes_auth.py")

    if current.group(0) == block:
        print(f"in step: {len(listed)} marks")
        return 1 if unlisted else 0

    if check_only:
        print("OUT OF STEP: run scripts/export-marks.py to rewrite the API's list")
        return 1

    io.open(API, "w", encoding="utf-8", newline="\n").write(
        src[: current.start()] + block + src[current.end() :]
    )
    print(f"rewrote the API's list: {len(listed)} marks")
    return 1 if unlisted else 0


if __name__ == "__main__":
    raise SystemExit(main())
