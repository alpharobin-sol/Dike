'use client';

import { useEffect, useRef } from 'react';

// Grey fragments fly in from the left and lock into the bronze shield: waste becoming strength.
// Plays once on load. With reduced motion it draws the finished picture straight away.

type RGB = [number, number, number];
type Piece = {
  x0: number; y0: number; x1: number; y1: number;
  w: number; h: number; r0: number; r1: number;
  color: RGB; alpha: number; delay: number;
};

const TITANIUM: RGB = [141, 147, 154];
const CAST: RGB = [142, 83, 41];
const FORGED: RGB = [212, 145, 79];
const HIGHLIGHT: RGB = [242, 195, 142];
const SHIELD =
  'M10 10H54V32A22 22 0 0 1 10 32Z M15.9 15.9H48.1V32A16.1 16.1 0 0 1 15.9 32Z M19.1 19.1H44.9V32A12.9 12.9 0 0 1 19.1 32Z M23.4 23.4H40.6V32A8.6 8.6 0 0 1 23.4 32Z M26.6 26.6H37.4V32A5.4 5.4 0 0 1 26.6 32Z';
// The shield as five nested shapes (inset, radius); a point inside an odd number of them is solid.
const RINGS: [number, number][] = [[0, 22], [5.9, 16.1], [9.1, 12.9], [13.4, 8.6], [16.6, 5.4]];

const DURATION = 2400;
const STAGGER = 900;

function inShield(u: number, v: number) {
  let n = 0;
  for (const [i, r] of RINGS) {
    const a = 10 + i, b = 54 - i, top = 10 + i;
    if (u >= a && u <= b && v >= top && (v <= 32 || (u - 32) ** 2 + (v - 32) ** 2 <= r * r)) n++;
  }
  return n % 2 === 1;
}

const mix = (a: RGB, b: RGB, t: number): RGB =>
  [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const molten = (t: number) => (t < 0.55 ? mix(CAST, FORGED, t / 0.55) : mix(FORGED, HIGHLIGHT, (t - 0.55) / 0.45));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Wide screens: the shield sits right of the headline. Narrow screens: above it, top right,
// in the space Hero.module.css leaves free (keep the two in step).
function layout(w: number, h: number) {
  if (w >= 900) return { size: Math.min(h * 0.5, w * 0.28, 420), cx: w * 0.74, cy: h * 0.42, opacity: 1 };
  const size = Math.min(w * 0.42, 200);
  return { size, cx: w - 24 - size / 2, cy: 32 + size / 2, opacity: 1 };
}

function build(w: number, h: number): { pieces: Piece[]; L: ReturnType<typeof layout> } {
  const R = rng(11);
  const L = layout(w, h);
  const k = L.size / 44;
  const at = (u: number, v: number): [number, number] => [L.cx + (u - 32) * k, L.cy + (v - 32) * k];
  const target = (): [number, number] => {
    for (;;) {
      const u = 10 + R() * 44, v = 10 + R() * 44;
      if (inShield(u, v)) return [u, v];
    }
  };
  const tone = (u: number, v: number) => molten((u - 10 + (v - 10)) / 88);
  const gauss = () => (R() + R() + R() - 1.5) / 1.5;
  // Where fragments come from: anywhere left of the shield, bunched around its height.
  const left = -0.05 * w;
  const span = Math.max(L.cx - L.size - left, w * 0.3);
  const spread = w >= 900 ? h : L.size * 1.6; // narrow screens keep the stream clear of the headline
  const origin = (): [number, number] => [left + R() * span, L.cy + gauss() * spread * (0.25 + 0.4 * R())];
  const area = Math.min(Math.max((w * h) / (1500 * 700), 0.35), 1.4);
  const pieces: Piece[] = [];

  // Fragments still in flight: each sits partway along a curve toward its place in the shield.
  for (let n = 0, count = Math.round(5200 * area); n < count; n++) {
    const [u, v] = target();
    const [tx, ty] = at(u, v);
    const [ox, oy] = origin();
    const t = R() ** 0.7;
    const mx = (ox + tx) / 2 + (R() - 0.5) * 140, my = (oy + ty) / 2 + (R() - 0.5) * 180 - 30;
    const e = easeOut(t);
    const r = (R() - 0.5) * Math.PI * (1 - t);
    pieces.push({
      x0: ox - R() * w * 0.15, y0: oy + (R() - 0.5) * 60,
      x1: (1 - e) ** 2 * ox + 2 * (1 - e) * e * mx + e * e * tx,
      y1: (1 - e) ** 2 * oy + 2 * (1 - e) * e * my + e * e * ty,
      w: 2.2 + R() * 8 * (1 - t), h: 1.6 + R() * 3.8 * (1 - t),
      r0: r * 3, r1: r,
      color: mix(TITANIUM, tone(u, v), t ** 2.4),
      alpha: 0.32 + 0.55 * t ** 1.4,
      delay: R() * 0.6,
    });
  }

  // Fragments already locked into the shield.
  for (let n = 0, count = Math.min(Math.round(9000 * (L.size / 300) ** 2), 15000); n < count; n++) {
    const [u, v] = target();
    const [tx, ty] = at(u, v);
    const [ox, oy] = origin();
    const s = 1.4 + R() * 2.2;
    pieces.push({
      x0: ox, y0: oy, x1: tx, y1: ty, w: s, h: s,
      r0: (R() - 0.5) * Math.PI, r1: 0,
      color: tone(u, v), alpha: 0.7 + R() * 0.3,
      delay: 0.2 + R() * 0.8,
    });
  }
  return { pieces, L };
}

export default function Convergence({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const shield = new Path2D(SHIELD);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scene = { pieces: [] as Piece[], L: layout(1, 1), w: 0, h: 0 };
    let start = 0;
    let raf = 0;

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene = { ...build(w, h), w, h };
    };

    const draw = (time: number) => {
      const { pieces, L, w, h } = scene;
      const p = Math.min(time / (DURATION + STAGGER), 1);
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = L.opacity;

      const glow = ctx.createRadialGradient(L.cx, L.cy, 0, L.cx, L.cy, L.size * 1.9);
      glow.addColorStop(0, `rgba(212,145,79,${0.2 * p})`);
      glow.addColorStop(0.45, `rgba(142,83,41,${0.07 * p})`);
      glow.addColorStop(1, 'rgba(7,8,9,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // The shield's soft body fades in as the last fragments arrive.
      const body = Math.max(0, (p - 0.55) / 0.45);
      if (body > 0) {
        const k = L.size / 44;
        ctx.save();
        ctx.translate(L.cx - 32 * k, L.cy - 32 * k);
        ctx.scale(k, k);
        const g = ctx.createLinearGradient(10, 10, 54, 54);
        g.addColorStop(0, 'rgb(142,83,41)');
        g.addColorStop(0.55, 'rgb(212,145,79)');
        g.addColorStop(1, 'rgb(242,195,142)');
        ctx.shadowColor = 'rgba(212,145,79,0.55)';
        ctx.shadowBlur = 60;
        ctx.globalAlpha = L.opacity * 0.55 * body;
        ctx.fillStyle = g;
        ctx.fill(shield, 'evenodd');
        ctx.restore();
        ctx.globalAlpha = L.opacity;
      }

      for (const q of pieces) {
        const s = Math.min(Math.max((time - q.delay * STAGGER) / DURATION, 0), 1);
        const e = easeOut(s);
        const c = mix(TITANIUM, q.color, e);
        ctx.save();
        ctx.translate(q.x0 + (q.x1 - q.x0) * e, q.y0 + (q.y1 - q.y0) * e);
        ctx.rotate(q.r0 + (q.r1 - q.r0) * e);
        ctx.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${0.25 + (q.alpha - 0.25) * e})`;
        ctx.fillRect(-q.w / 2, -q.h / 2, q.w, q.h);
        ctx.restore();
      }
    };

    const end = DURATION + STAGGER;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = now - start;
      draw(Math.min(t, end));
      if (t < end) raf = requestAnimationFrame(tick);
    };

    resize();
    if (still) draw(end);
    else raf = requestAnimationFrame(tick);

    const observer = new ResizeObserver(() => {
      const animating = !still && start && performance.now() - start < end;
      resize();
      if (!animating) draw(end);
    });
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
