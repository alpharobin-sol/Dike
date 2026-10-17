# Dike Industries brand kit

**Dike** /dee-keh/ is Igbo for brave, strong.

| Line | Use it for |
|---|---|
| **Engineered from Waste. Built for the Future.** | Tagline. Under the logo, business cards, social bios, site footer |
| Building the future from what the world throws away. | Manifesto. Website hero, deck cover, launch video |
| We turn waste into tested materials, parts and equipment for industry and defence. | Mission line. What we do, in one sentence |
| To build a globally competitive industrial and defence manufacturer that turns recycled materials into high-performance hardware. | Vision line. Decks and the About page |
| From waste to strength | Sign-off |

The brand book lives in `identity.html`. Round 1 explorations are in `directions.html` and `explorations/`.

Shared pages (private until shared from each page's Share menu):

- Design system: https://claude.ai/artifact/Rv6LX1T5Phoq71PkvKNeDy
- Pitch deck: https://claude.ai/artifact/5tEtbkXL9MvBNrqmTuifuP
- Brand book: https://claude.ai/artifact/WeoKZ8x4To88eTgq7ktn3i

## What's in the kit

| Folder | Contents |
|---|---|
| `logo/svg/` | Every logo as a vector file with the lettering converted to outlines. No fonts needed |
| `logo/png/` | The same files as transparent PNGs, 2048 px on the long side |
| `icons/` | `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `site.webmanifest`, `email-mark.png` |
| `tokens/` | `tokens.css` (CSS variables and type styles) and `tokens.json` (the same values for design tools) |
| `templates/` | Business card and letterhead (HTML to edit, PDF to print), email signature |
| `web/` | Website hero: `index.html` and `hero.css`, built on the tokens |
| `social/` | Profile pictures and banners for X, LinkedIn, Facebook and YouTube, plus a link preview image |
| `tools/` | Scripts that rebuild every file above |

## Logo

Four versions, each in four colors. File names follow `dike-{version}-{color}.svg`.

| Version | When to use it |
|---|---|
| `horizontal` | The default |
| `stacked` | Square or tall spaces: social avatars, signage, merchandise |
| `wordmark` | When the shield already appears nearby |
| `mark` | Small spaces, app icons, product markings |

| Color | Background |
|---|---|
| `on-dark` | Void or any dark ground. Forged Bronze shield, Nzu White name |
| `on-light` | Nzu White or any light ground. Cast Bronze shield, Void name |
| `white` | Photos and colored grounds |
| `black` | One-color printing, stamps, engraving |

**Clear space.** Leave space equal to half the shield's height on every side.

**Minimum size.** Horizontal logo: 180 px wide on screen, 40 mm in print. Below that, INDUSTRIES gets too small to read, so use the mark alone. Mark: 16 px, 5 mm.

**Don't** recolor the logo outside the palette, stretch or rotate it, add shadows or the molten gradient, move the shield and name apart, or place it on a busy photo without enough contrast.

## Color

| Name | Hex | Role |
|---|---|---|
| Void | `#070809` | Main ground, text on light |
| Carbon | `#121418` | Panels, cards and plates on black |
| Graphite | `#24272C` | Lines on black |
| Titanium | `#8D939A` | Secondary text and lines |
| Nzu White | `#F4F3EF` | Text on black, light ground |
| Forged Bronze | `#D4914F` | Mark and accent on black (7.6:1 on Void) |
| Cast Bronze | `#8E5329` | Mark and accent on white (5.5:1 on Nzu White) |
| Molten | `#8E5329 → #D4914F → #F2C38E` | Gradient for launch graphics and hero moments. Never on the logo |

## Type

| Face | Weights | Job |
|---|---|---|
| Barlow Condensed | 600, 700, 800 | Logo, headlines, signage, product markings. Always uppercase |
| Archivo | 400 to 700 | Body text, documents, website copy |
| IBM Plex Mono | 400, 500 | Specs, part codes, test data, labels |

All three are free on Google Fonts under the SIL Open Font License.

## Voice

- Proof before claims. Write "Passed ISO 180 impact testing at 23 °C," never "ultra-tough."
- Strong, never loud. No war talk, no hype.
- Say "recycled" plainly, with the percentage.
- Plain words. Engineers and procurement teams read everything we write.

## Social media

| File | Size | Where it goes |
|---|---|---|
| `dike-avatar-dark.png` | 1080 × 1080 | Profile picture on X, LinkedIn, Instagram, Facebook, YouTube. The default |
| `dike-avatar-bronze.png` | 1080 × 1080 | Alternate profile picture for campaigns and launches |
| `dike-avatar-light.png` | 1080 × 1080 | Profile picture where the platform background is light |
| `dike-x-header-convergence.png` | 3000 × 1000 | X header, recommended. Grey fragments stream in and lock into the bronze shield |
| `dike-x-header-horizon.png` | 3000 × 1000 | X header, alternate. The shield stands on a glowing horizon |
| `dike-x-header.png` | 1500 × 500 | X header, simple type-led version |
| `dike-linkedin-company-cover.png` | 2256 × 382 | LinkedIn company page cover (1128 × 191 at 2x) |
| `dike-linkedin-founder-banner.png` | 1584 × 396 | Emmanuel Udeze's LinkedIn profile banner |
| `dike-facebook-cover.png` | 1640 × 624 | Facebook page cover |
| `dike-youtube-banner.png` | 2560 × 1440 | YouTube channel banner. Text sits in the 1546 × 423 safe area |
| `dike-link-preview.png` | 1200 × 630 | Link preview for the website (`og:image`) |

Use one profile picture everywhere so people recognize the account. Rebuild with `node brand/tools/render_social.js` and `node brand/tools/render_x_hero.js`.

## Templates

Fill in the bracketed fields (`[email]`, `[phone]`, `[website]`, address) before printing or sending.

- **Business card.** 85 × 55 mm with 3 mm bleed. Send `business-card.pdf` to the printer.
- **Letterhead.** A4. Edit the letter in `letterhead.html`, then print to PDF.
- **Email signature.** Steps are at the top of `email-signature.html`.

## Rebuild the files

```sh
brand/tools/fetch_fonts.sh                 # brand fonts into brand/fonts/ (not committed)
pip install fonttools pillow
cd brand/tools && python3 build_logos.py && python3 build_icons.py && cd ../..
node brand/tools/render.js                 # PNGs, app icons and PDFs (needs Playwright)
```

`render.js` also writes `icons/.favicon-256.png`. Turn it into `favicon.ico` with Pillow:

```sh
python3 -c "from PIL import Image; Image.open('brand/icons/.favicon-256.png').save('brand/icons/favicon.ico', sizes=[(16,16),(32,32),(48,48)])"
```
