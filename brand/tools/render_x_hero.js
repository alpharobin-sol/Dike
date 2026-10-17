// Render the two hero X headers into brand/social/ at 2x (3000 x 1000).
//   Convergence: scattered grey fragments stream in from the left and lock into the bronze shield.
//   Horizon:     the shield stands on a glowing horizon like a product on a stage, reflected below.
// Usage: node tools/render_x_hero.js   (needs Playwright; fonts load from Google Fonts)
const path = require('path');
const { chromium } = require('playwright');

const out = path.join(path.resolve(__dirname, '..'), 'social');
const W = 1500, H = 500, DPR = 2;

const shared = `
  // Seeded random, so every render is identical.
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // The shield as five nested shapes; a point inside an odd number of them is solid.
  const RINGS = [[0, 22], [5.9, 16.1], [9.1, 12.9], [13.4, 8.6], [16.6, 5.4]];
  function inShield(u, v) {
    let n = 0;
    for (const [i, r] of RINGS) {
      const a = 10 + i, b = 54 - i, top = 10 + i;
      if (u >= a && u <= b && v >= top && (v <= 32 || (u - 32) ** 2 + (v - 32) ** 2 <= r * r)) n++;
    }
    return n % 2 === 1;
  }
  const SHIELD = new Path2D('M10 10H54V32A22 22 0 0 1 10 32Z M15.9 15.9H48.1V32A16.1 16.1 0 0 1 15.9 32Z M19.1 19.1H44.9V32A12.9 12.9 0 0 1 19.1 32Z M23.4 23.4H40.6V32A8.6 8.6 0 0 1 23.4 32Z M26.6 26.6H37.4V32A5.4 5.4 0 0 1 26.6 32Z');
  const mix = (a, b, t) => a.map((x, i) => Math.round(x + (b[i] - x) * t));
  const TI = [141, 147, 154], CAST = [142, 83, 41], FORGED = [212, 145, 79], HI = [242, 195, 142];
  function molten(t) { return t < 0.55 ? mix(CAST, FORGED, t / 0.55) : mix(FORGED, HI, (t - 0.55) / 0.45); }
  const cv = document.getElementById('c'); cv.width = ${W * DPR}; cv.height = ${H * DPR};
  const ctx = cv.getContext('2d'); ctx.scale(${DPR}, ${DPR});
`;

const convergence = `
  const R = rng(11);
  const cx = 1100, cy = 228, S = 300, k = S / 44;
  const at = (u, v) => [cx + (u - 32) * k, cy + (v - 32) * k];
  const target = () => { for (;;) { const u = 10 + R() * 44, v = 10 + R() * 44; if (inShield(u, v)) return [u, v]; } };
  const tone = (u, v) => molten(((u - 10) + (v - 10)) / 88);

  ctx.fillStyle = '#070809'; ctx.fillRect(0, 0, ${W}, ${H});
  let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 560);
  g.addColorStop(0, 'rgba(212,145,79,0.20)'); g.addColorStop(0.45, 'rgba(142,83,41,0.07)'); g.addColorStop(1, 'rgba(7,8,9,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, ${W}, ${H});

  // The stream: each fragment flies from a scattered spot on the left toward its place in the shield.
  const gauss = () => (R() + R() + R() - 1.5) / 1.5;
  for (let n = 0; n < 6500; n++) {
    const [u, v] = target(); const [tx, ty] = at(u, v);
    const t = Math.pow(R(), 0.7);
    const ox = -80 + R() * 980, oy = ${H} / 2 + gauss() * ${H} * (0.25 + 0.45 * R());
    const mx = (ox + tx) / 2 + (R() - 0.5) * 140, my = (oy + ty) / 2 + (R() - 0.5) * 180 - 30;
    const e = 1 - Math.pow(1 - t, 3);
    const x = (1 - e) ** 2 * ox + 2 * (1 - e) * e * mx + e * e * tx;
    const y = (1 - e) ** 2 * oy + 2 * (1 - e) * e * my + e * e * ty;
    const col = mix(TI, tone(u, v), Math.pow(t, 2.4));
    const a = 0.32 + 0.55 * Math.pow(t, 1.4);
    const w = 2.2 + R() * 8 * (1 - t), h = 1.6 + R() * 3.8 * (1 - t);
    ctx.save(); ctx.translate(x, y); ctx.rotate((R() - 0.5) * Math.PI * (1 - t));
    ctx.fillStyle = 'rgba(' + col + ',' + a + ')'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore();
  }

  // The shield: a soft glowing body, then thousands of locked-in fragments on top.
  ctx.save(); ctx.translate(cx - 32 * k, cy - 32 * k); ctx.scale(k, k);
  const sg = ctx.createLinearGradient(10, 10, 54, 54);
  sg.addColorStop(0, 'rgb(142,83,41)'); sg.addColorStop(0.55, 'rgb(212,145,79)'); sg.addColorStop(1, 'rgb(242,195,142)');
  ctx.shadowColor = 'rgba(212,145,79,0.55)'; ctx.shadowBlur = 60; ctx.globalAlpha = 0.55; ctx.fillStyle = sg; ctx.fill(SHIELD, 'evenodd');
  ctx.restore();
  for (let n = 0; n < 9000; n++) {
    const [u, v] = target(); const [x, y] = at(u, v); const s = 1.4 + R() * 2.2;
    ctx.fillStyle = 'rgba(' + tone(u, v) + ',' + (0.7 + R() * 0.3) + ')'; ctx.fillRect(x - s / 2, y - s / 2, s, s);
  }
`;

const horizon = `
  const R = rng(5);
  const hy = 330, cx = 760, S = 230, k = S / 44;
  // Sky warms toward the horizon; the floor below stays near black.
  let g = ctx.createLinearGradient(0, 0, 0, hy);
  g.addColorStop(0, '#070809'); g.addColorStop(1, '#140e0a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, ${W}, hy);
  g = ctx.createLinearGradient(0, hy, 0, ${H});
  g.addColorStop(0, '#0d0b0a'); g.addColorStop(1, '#070809');
  ctx.fillStyle = g; ctx.fillRect(0, hy, ${W}, ${H} - hy);

  // Wide elliptical glow sitting on the horizon.
  ctx.save(); ctx.translate(cx, hy); ctx.scale(1, 0.22);
  g = ctx.createRadialGradient(0, 0, 0, 0, 0, 900);
  g.addColorStop(0, 'rgba(242,195,142,0.55)'); g.addColorStop(0.18, 'rgba(212,145,79,0.30)');
  g.addColorStop(0.5, 'rgba(142,83,41,0.10)'); g.addColorStop(1, 'rgba(7,8,9,0)');
  ctx.fillStyle = g; ctx.fillRect(-900, -900, 1800, 1800); ctx.restore();
  // Halo behind the shield.
  g = ctx.createRadialGradient(cx, hy - S * 0.45, 0, cx, hy - S * 0.45, 340);
  g.addColorStop(0, 'rgba(212,145,79,0.22)'); g.addColorStop(1, 'rgba(7,8,9,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, ${W}, ${H});

  // The horizon line: bright at the centre, fading to the edges.
  g = ctx.createLinearGradient(0, 0, ${W}, 0);
  g.addColorStop(0, 'rgba(242,195,142,0)'); g.addColorStop(0.5, 'rgba(242,195,142,0.95)'); g.addColorStop(1, 'rgba(242,195,142,0)');
  ctx.fillStyle = g; ctx.fillRect(0, hy - 0.75, ${W}, 1.5);

  // Fine dust in the warm air above the horizon.
  for (let n = 0; n < 500; n++) {
    const x = R() * ${W}, y = hy - Math.pow(R(), 2.2) * 260, s = 0.6 + R() * 1.4;
    const a = (0.05 + R() * 0.25) * (1 - Math.abs(x - cx) / 900);
    if (a > 0) { ctx.fillStyle = 'rgba(242,195,142,' + a + ')'; ctx.fillRect(x, y, s, s); }
  }

  // The shield standing on the horizon, lit from below; the ridges let the glow show through.
  const x0 = cx - 32 * k, y0 = hy - 54 * k;
  function drawShield(alpha) {
    ctx.save(); ctx.translate(x0, y0); ctx.scale(k, k);
    const sg = ctx.createLinearGradient(0, 10, 0, 54);
    sg.addColorStop(0, 'rgb(212,145,79)'); sg.addColorStop(0.7, 'rgb(170,108,58)'); sg.addColorStop(1, 'rgb(242,195,142)');
    ctx.globalAlpha = alpha; ctx.fillStyle = sg; ctx.fill(SHIELD, 'evenodd'); ctx.restore();
  }
  ctx.save(); ctx.shadowColor = 'rgba(212,145,79,0.6)'; ctx.shadowBlur = 50; drawShield(1); ctx.restore();

  // Reflection on the floor, fading out.
  ctx.save(); ctx.beginPath(); ctx.rect(0, hy + 1, ${W}, ${H}); ctx.clip();
  ctx.translate(0, 2 * hy); ctx.scale(1, -1); drawShield(0.22); ctx.restore();
  g = ctx.createLinearGradient(0, hy, 0, hy + 170);
  g.addColorStop(0, 'rgba(7,8,9,0)'); g.addColorStop(1, 'rgba(7,8,9,1)');
  ctx.fillStyle = g; ctx.fillRect(0, hy + 1, ${W}, 170);
`;

const page = (script, tag) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&display=swap">
<style>
  html,body{margin:0;background:#070809}
  .wrap{position:relative;width:${W}px;height:${H}px;overflow:hidden}
  canvas{position:absolute;inset:0;width:${W}px;height:${H}px}
  .tag{position:absolute;margin:0;text-align:right;line-height:1.35;font-family:'Barlow Condensed',sans-serif;font-weight:600;
       font-size:26px;letter-spacing:.2em;text-transform:uppercase;color:rgba(244,243,239,.9);white-space:nowrap}
</style></head><body><div class="wrap"><canvas id="c"></canvas>
<p class="tag" style="${tag}">Engineered from waste.${tag.includes('top') ? '<br>' : ' '}Built for the future.</p></div>
<script>${shared}${script}</script></body></html>`;

(async () => {
  const browser = await chromium.launch();
  for (const [file, script, tag] of [
    ['dike-x-header-convergence.png', convergence, 'right:72px;bottom:78px'],
    ['dike-x-header-horizon.png', horizon, 'right:80px;top:150px;font-size:30px'],
  ]) {
    const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
    await p.setContent(page(script, tag), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(out, file), clip: { x: 0, y: 0, width: W, height: H } });
    await p.close();
  }
  await browser.close();
  console.log('rendered hero X headers to', out);
})();
