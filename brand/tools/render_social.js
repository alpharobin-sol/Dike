// Render the Dike social media kit into brand/social/.
//   Profile pictures (1080 x 1080) and platform banners at each platform's upload size.
// Usage: node tools/render_social.js   (needs Playwright; fonts load from Google Fonts)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'social');
const logo = name => fs.readFileSync(path.join(root, 'logo', 'svg', name), 'utf8')
  .replace(/\swidth="[^"]*" height="[^"]*"/, '');

const VOID = '#070809', WHITE = '#F4F3EF', FORGED = '#D4914F', CAST = '#8E5329', TI = '#8D939A';
const SHIELD = 'M10 10H54V32A22 22 0 0 1 10 32Z M15.9 15.9H48.1V32A16.1 16.1 0 0 1 15.9 32Z M19.1 19.1H44.9V32A12.9 12.9 0 0 1 19.1 32Z M23.4 23.4H40.6V32A8.6 8.6 0 0 1 23.4 32Z M26.6 26.6H37.4V32A5.4 5.4 0 0 1 26.6 32Z';

// The large background shield in the molten gradient.
const molten = (x, y, size, opacity) => `
  <svg viewBox="10 10 44 44" style="position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;opacity:${opacity}">
    <defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${CAST}"/><stop offset=".55" stop-color="${FORGED}"/><stop offset="1" stop-color="#F2C38E"/>
    </linearGradient></defs>
    <path fill="url(#m)" fill-rule="evenodd" d="${SHIELD}"/>
  </svg>`;

const page = (w, h, bg, body) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
  html,body{margin:0}
  .c{position:relative;overflow:hidden;width:${w}px;height:${h}px;background:${bg};color:${WHITE}}
  .eye{position:absolute;font-family:'IBM Plex Mono',monospace;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:${FORGED};margin:0;white-space:nowrap}
  .h{position:absolute;font-family:'Barlow Condensed',sans-serif;font-weight:800;text-transform:uppercase;line-height:.9;letter-spacing:.005em;margin:0}
  .logo{position:absolute;display:block;height:auto}
</style></head><body><div class="c">${body}</div></body></html>`;

// Profile picture: shield centred, nudged down a touch because its weight sits high.
// At 52% of the width it stays clear of a circular crop.
const avatar = (bg, fg) => page(1080, 1080, bg, `
  <svg viewBox="10 10 44 44" style="position:absolute;left:260px;top:276px;width:560px;height:560px">
    <path fill="${fg}" fill-rule="evenodd" d="${SHIELD}"/>
  </svg>`);

const assets = [
  { file: 'dike-avatar-dark.png', w: 1080, h: 1080, html: avatar(VOID, FORGED) },
  { file: 'dike-avatar-bronze.png', w: 1080, h: 1080, html: avatar(FORGED, VOID) },
  { file: 'dike-avatar-light.png', w: 1080, h: 1080, html: avatar(WHITE, CAST) },

  // X header. The profile picture covers the bottom-left corner, so text stays above y 310.
  { file: 'dike-x-header.png', w: 1500, h: 500, html: page(1500, 500, VOID, `
    ${molten(980, -20, 640, .35)}
    <p class="eye" style="left:96px;top:84px;font-size:20px">Dike Industries · /dee-keh/</p>
    <h1 class="h" style="left:96px;top:128px;font-size:96px">Engineered from waste.<br>Built for the future.</h1>`) },

  // LinkedIn company page cover, 1128 x 191 drawn at 2x. The logo sits over the left end.
  { file: 'dike-linkedin-company-cover.png', w: 1128, h: 191, scale: 2, html: page(1128, 191, VOID, `
    ${molten(-40, -40, 300, .3)}
    <h1 class="h" style="right:56px;top:58px;font-size:40px;text-align:right">Engineered from waste. Built for the future.</h1>
    <p class="eye" style="right:56px;top:108px;font-size:13px">Industrial &amp; defence manufacturing</p>`) },

  // LinkedIn personal banner for the founder. The profile photo covers the left end.
  { file: 'dike-linkedin-founder-banner.png', w: 1584, h: 396, html: page(1584, 396, VOID, `
    ${molten(1300, -60, 520, .3)}
    <p class="eye" style="left:460px;top:92px;font-size:20px">Emmanuel Udeze · Founder, Dike Industries</p>
    <h1 class="h" style="left:460px;top:136px;font-size:68px">Building the future from<br>what the world throws away.</h1>`) },

  // Facebook cover. Phones crop the sides and the profile picture covers the bottom-left.
  { file: 'dike-facebook-cover.png', w: 1640, h: 624, html: page(1640, 624, VOID, `
    ${molten(1080, -40, 760, .28)}
    <div class="logo" style="left:240px;top:150px;width:360px">${logo('dike-horizontal-on-dark.svg')}</div>
    <h1 class="h" style="left:240px;top:318px;font-size:84px">Engineered from waste.<br>Built for the future.</h1>`) },

  // YouTube channel art. Everything that matters sits in the 1546 x 423 safe area in the middle.
  { file: 'dike-youtube-banner.png', w: 2560, h: 1440, html: page(2560, 1440, VOID, `
    ${molten(1640, 160, 1300, .3)}
    <div class="logo" style="left:547px;top:520px;width:500px">${logo('dike-horizontal-on-dark.svg')}</div>
    <h1 class="h" style="left:547px;top:740px;font-size:96px">Engineered from waste.<br>Built for the future.</h1>`) },

  // Link preview (Open Graph) for the website and shared links.
  { file: 'dike-link-preview.png', w: 1200, h: 630, html: page(1200, 630, VOID, `
    ${molten(780, 70, 560, .3)}
    <div class="logo" style="left:72px;top:64px;width:280px">${logo('dike-horizontal-on-dark.svg')}</div>
    <h1 class="h" style="left:72px;top:222px;width:760px;font-size:76px">Building the future from what the world throws away.</h1>
    <p class="eye" style="left:72px;bottom:60px;font-size:18px;color:${TI}">Engineered from waste. Built for the future.</p>`) },
];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  for (const a of assets) {
    const p = await browser.newPage({ viewport: { width: a.w, height: a.h }, deviceScaleFactor: a.scale || 1 });
    await p.setContent(a.html, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, a.file), clip: { x: 0, y: 0, width: a.w, height: a.h } });
    await p.close();
  }
  await browser.close();
  console.log(`rendered ${assets.length} files to ${out}`);
})();
