"""Build the Dike logo SVGs with the wordmark converted to outlines.

Run tools/fetch_fonts.sh first. Writes brand/logo/svg/.
Geometry follows the lockup on the identity page: the mark is a 64-unit
box, DIKE is Barlow Condensed ExtraBold at 1.22x the box, INDUSTRIES is
Barlow Condensed SemiBold at 0.125x with 0.56em tracking.
"""
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "fonts"
OUT = ROOT / "logo" / "svg"

S = 100.0  # mark box size; every other measure scales from it


def num(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")

# Shield in its 64-unit box: outer shape minus two ridge bands, as one
# even-odd path so it needs no masks.
def shield(x0, y0, k):
    def shape(i, r):
        a, b, top = 10 + i, 54 - i, 10 + i
        return (f"M{x0 + a * k:.2f} {y0 + top * k:.2f}H{x0 + b * k:.2f}V{y0 + 32 * k:.2f}"
                f"A{r * k:.2f} {r * k:.2f} 0 0 1 {x0 + a * k:.2f} {y0 + 32 * k:.2f}Z")
    return " ".join([shape(0, 22), shape(5.9, 16.1), shape(9.1, 12.9), shape(13.4, 8.6), shape(16.6, 5.4)])

COLORS = {
    "on-dark": {"mark": "#D4914F", "name": "#F4F3EF", "sub": "#D4914F"},
    "on-light": {"mark": "#8E5329", "name": "#070809", "sub": "#8E5329"},
    "white": {"mark": "#FFFFFF", "name": "#FFFFFF", "sub": "#FFFFFF"},
    "black": {"mark": "#070809", "name": "#070809", "sub": "#070809"},
}


class Face:
    def __init__(self, file):
        self.font = TTFont(FONTS / file)
        self.gs = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.upm = self.font["head"].unitsPerEm
        self.hmtx = self.font["hmtx"]

    def run(self, text, size, x, baseline, tracking_em):
        """Return (path data, ink bounds) for text set from x on baseline."""
        k = size / self.upm
        parts, ink = [], None
        for ch in text:
            g = self.cmap[ord(ch)]
            pen = SVGPathPen(self.gs, ntos=num)
            self.gs[g].draw(TransformPen(pen, (k, 0, 0, -k, x, baseline)))
            parts.append(pen.getCommands())
            bp = BoundsPen(self.gs)
            self.gs[g].draw(TransformPen(bp, (k, 0, 0, -k, x, baseline)))
            if bp.bounds:
                b = bp.bounds
                ink = b if ink is None else (min(ink[0], b[0]), min(ink[1], b[1]), max(ink[2], b[2]), max(ink[3], b[3]))
            x += self.hmtx[g][0] * k + tracking_em * size
        return " ".join(parts), ink


NAME = Face("BarlowCondensed-ExtraBold.ttf")
SUB = Face("BarlowCondensed-SemiBold.ttf")
FN, FS = 1.22 * S, 0.125 * S
CAP = 0.70 * FN


def word(x, cap_top):
    """DIKE and INDUSTRIES as on the page: sub sits 0.95em + half-leading below the name."""
    base_n = cap_top + CAP
    name, ink_n = NAME.run("DIKE", FN, x, base_n, 0.005)
    base_s = base_n + 0.95 * FS + (1.55 * FS - 1.2 * FS) / 2 + 1.0 * FS
    sub, ink_s = SUB.run("INDUSTRIES", FS, x + 0.05 * FS, base_s, 0.56)
    return name, ink_n, sub, ink_s


def union(*bs):
    return (min(b[0] for b in bs), min(b[1] for b in bs), max(b[2] for b in bs), max(b[3] for b in bs))


def svg(layers, bounds, title):
    """layers: (path data, fill, evenodd, transform)"""
    x0, y0, x1, y1 = bounds
    w, h = x1 - x0, y1 - y0
    rows = []
    for d, fill, evenodd, tf in layers:
        attrs = f'fill="{fill}"' + (' fill-rule="evenodd"' if evenodd else "") + (f' transform="{tf}"' if tf else "")
        rows.append(f'<path {attrs} d="{d}"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{num(x0)} {num(y0)} {num(w)} {num(h)}" '
            f'width="{w * 4:.0f}" height="{h * 4:.0f}">\n  <title>{title}</title>\n  '
            + "\n  ".join(rows) + "\n</svg>\n")


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    k = S / 64
    sh = 44 * k  # visible shield height (and width)

    def shield_box(x0, y0):
        return (x0 + 10 * k, y0 + 10 * k, x0 + 54 * k, y0 + 54 * k)

    # Horizontal: mark box, 0.26 gap, word column. The shield's base sits on the DIKE baseline.
    hy = CAP - 54 * k
    h_name, h_ink_n, h_sub, h_ink_s = word(S + 0.26 * S, 0)
    h_mark = shield(0, hy, k)
    h_bounds = union(shield_box(0, hy), h_ink_n, h_ink_s)

    # Stacked: shield centred over the word with half a shield height of air.
    s_name, s_ink_n, s_sub, s_ink_s = word(0, 1.5 * sh)
    axis = (s_ink_n[0] + s_ink_n[2]) / 2
    shift = axis - (s_ink_s[0] + s_ink_s[2]) / 2
    sx = axis - 32 * k
    s_mark = shield(sx, -10 * k, k)
    s_bounds = union(shield_box(sx, -10 * k), s_ink_n, (s_ink_s[0] + shift, s_ink_s[1], s_ink_s[2] + shift, s_ink_s[3]))

    for cw, c in COLORS.items():
        files = {
            "horizontal": svg([(h_mark, c["mark"], True, None), (h_name, c["name"], False, None),
                               (h_sub, c["sub"], False, None)], h_bounds, "Dike Industries"),
            "stacked": svg([(s_mark, c["mark"], True, None), (s_name, c["name"], False, None),
                            (s_sub, c["sub"], False, f"translate({num(shift)} 0)")], s_bounds, "Dike Industries"),
            "wordmark": svg([(h_name, c["name"], False, None), (h_sub, c["sub"], False, None)],
                            union(h_ink_n, h_ink_s), "Dike Industries"),
            "mark": svg([(shield(0, 0, k), c["mark"], True, None)], shield_box(0, 0), "Dike shield"),
        }
        for layout, text in files.items():
            (OUT / f"dike-{layout}-{cw}.svg").write_text(text)
    print(f"wrote {len(list(OUT.glob('*.svg')))} files to {OUT}")


if __name__ == "__main__":
    build()
