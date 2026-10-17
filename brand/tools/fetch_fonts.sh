#!/usr/bin/env bash
# Download the brand fonts (static TTFs) from Google Fonts into brand/fonts/.
# All three families are under the SIL Open Font License 1.1.
set -euo pipefail
cd "$(dirname "$0")/../fonts" 2>/dev/null || { mkdir -p "$(dirname "$0")/../fonts"; cd "$(dirname "$0")/../fonts"; }
css=$(curl -sS "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Archivo:wght@400;500;600;700")
python3 - "$css" <<'PY'
import re, sys, subprocess
names = {400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold"}
for blk in re.findall(r"@font-face\s*\{(.*?)\}", sys.argv[1], re.S):
    fam = re.search(r"font-family:\s*'([^']+)'", blk).group(1)
    w = int(re.search(r"font-weight:\s*(\d+)", blk).group(1))
    url = re.search(r"url\((https://[^)]+\.ttf)\)", blk).group(1)
    out = f"{fam.replace(' ', '')}-{names[w]}.ttf"
    subprocess.run(["curl", "-sSf", "-o", out, url], check=True)
    print(out)
PY
