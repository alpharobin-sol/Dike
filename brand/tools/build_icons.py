"""Write the favicon and app icon SVGs plus the web manifest into brand/icons/.

PNG and ICO files come from tools/render.js and the ico step at the end of it.
"""
import json
from pathlib import Path

from build_logos import shield

ICONS = Path(__file__).resolve().parent.parent / "icons"

VOID, FORGED, CAST = "#070809", "#D4914F", "#8E5329"


def app_icon(mark_share):
    """Square Void tile with the Forged Bronze shield centred at mark_share of the width."""
    size = 512
    k = size * mark_share / 44
    x0 = size / 2 - 32 * k
    y0 = size / 2 - 32 * k
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">\n'
            f'  <rect width="{size}" height="{size}" fill="{VOID}"/>\n'
            f'  <path fill="{FORGED}" fill-rule="evenodd" d="{shield(x0, y0, k)}"/>\n</svg>\n')


def build():
    ICONS.mkdir(parents=True, exist_ok=True)
    # Browser tab icon: bare shield, Cast Bronze on light tabs, Forged Bronze on dark ones.
    (ICONS / "favicon.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 10 44 44">\n'
        f'  <style>path{{fill:{CAST}}}@media (prefers-color-scheme:dark){{path{{fill:{FORGED}}}}}</style>\n'
        f'  <path fill-rule="evenodd" d="{shield(0, 0, 1)}"/>\n</svg>\n')
    (ICONS / "app-icon.svg").write_text(app_icon(0.58))
    # Maskable icons get cropped to a circle; keep the shield inside the 80% safe zone.
    (ICONS / "app-icon-maskable.svg").write_text(app_icon(0.50))
    manifest = {
        "name": "Dike Industries",
        "short_name": "Dike",
        "icons": [
            {"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
        "theme_color": VOID,
        "background_color": VOID,
        "display": "standalone",
    }
    (ICONS / "site.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n")
    print("icons written to", ICONS)


if __name__ == "__main__":
    build()
