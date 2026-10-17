// Render the raster and print files of the Dike brand kit.
//   logo/svg/*.svg      -> logo/png/*.png (transparent, longest side 2048 px)
//   icons/*.svg         -> app icons, apple-touch icon, email mark, favicon sources
//   templates/*.html    -> business-card.pdf, letterhead.pdf
// Usage: node tools/render.js   (needs Playwright; the templates load fonts from Google Fonts)
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const p = (...a) => path.join(root, ...a);

async function svgToPng(page, svgFile, pngFile, longSide) {
  const svg = fs.readFileSync(svgFile, 'utf8');
  const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const k = longSide / Math.max(w, h);
  const W = Math.round(w * k), H = Math.round(h * k);
  const sized = svg.replace(/<svg([^>]*?)(\swidth="[^"]*")?(\sheight="[^"]*")?>/, `<svg$1 width="${W}" height="${H}">`);
  await page.setViewportSize({ width: W, height: H });
  await page.setContent(`<html><body style="margin:0;background:transparent">${sized}</body></html>`);
  await page.screenshot({ path: pngFile, omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  fs.mkdirSync(p('logo', 'png'), { recursive: true });
  for (const f of fs.readdirSync(p('logo', 'svg')).filter(f => f.endsWith('.svg'))) {
    await svgToPng(page, p('logo', 'svg', f), p('logo', 'png', f.replace('.svg', '.png')), 2048);
  }

  const icons = [
    ['app-icon.svg', 'apple-touch-icon.png', 180],
    ['app-icon.svg', 'icon-192.png', 192],
    ['app-icon.svg', 'icon-512.png', 512],
    ['app-icon-maskable.svg', 'icon-maskable-512.png', 512],
  ];
  for (const [src, out, size] of icons) await svgToPng(page, p('icons', src), p('icons', out), size);
  // Email signature mark: Cast Bronze shield, 2x for sharp display at 40 px.
  await svgToPng(page, p('logo', 'svg', 'dike-mark-on-light.svg'), p('icons', 'email-mark.png'), 80);
  // Favicon source for the .ico (Forged Bronze reads on light and dark tabs).
  await svgToPng(page, p('logo', 'svg', 'dike-mark-on-dark.svg'), p('icons', '.favicon-256.png'), 256);

  for (const name of ['business-card', 'letterhead']) {
    await page.goto(pathToFileURL(p('templates', `${name}.html`)).href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: p('templates', `${name}.pdf`), preferCSSPageSize: true, printBackground: true });
  }

  await browser.close();
  console.log('rendered logos, icons and PDFs');
})();
