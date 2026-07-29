"use client";

import { useEffect, useRef } from "react";

import { COMMUNITIES, type CommunityId } from "@/lib/communities";
import { cn } from "@/lib/utils";

/**
 * The plaza, seen from above.
 *
 * This is the one place the two chosen directions meet. The geometry is
 * Wayfinding — ten community lines on a 45°/90° transit grid, meeting at
 * interchange rings. The light is Blue Hour — warm pools gathering where the
 * paths cross, and one brighter node at the centre standing for the single
 * identity that travels across all of them.
 *
 * Canvas rather than SVG because the light pools use additive blending, which
 * SVG filters do far more expensively for the same result.
 *
 * The composition is hand-authored, not generated. A signature visual that
 * reshuffles itself on every load is not an identity, and the crossings have to
 * land in specific places for the diagram to read.
 */

/**
 * Normalised polylines, one per community, in the canonical palette order.
 *
 * The composition focuses right of centre rather than dead centre. Two reasons:
 * it is better composition, and in the hero the left third sits under a scrim
 * that carries the headline — a focal point at 0.5 would be half-hidden by the
 * very thing it is supposed to be behind.
 *
 * Several lines are routed deliberately through FOCUS. The diagram has to read
 * as convergence; without that it is just a scatter of coloured lines, which is
 * a decoration rather than an argument.
 */
const LINES: Record<CommunityId, [number, number][]> = {
  bitcoin: [
    [0.02, 0.78],
    [0.2, 0.6],
    [0.44, 0.6],
    [0.54, 0.5],
    [0.98, 0.5],
  ],
  ai: [
    [0.02, 0.3],
    [0.26, 0.3],
    [0.4, 0.44],
    [0.6, 0.44],
    [0.74, 0.58],
    [0.98, 0.58],
  ],
  design: [
    [0.1, 0.98],
    [0.1, 0.68],
    [0.28, 0.5],
    [0.6, 0.5],
    [0.8, 0.3],
    [0.8, 0.02],
  ],
  collecting: [
    [0.02, 0.52],
    [0.2, 0.52],
    [0.34, 0.38],
    [0.66, 0.38],
    [0.84, 0.2],
  ],
  opensource: [
    [0.24, 0.02],
    [0.24, 0.46],
    [0.38, 0.6],
    [0.6, 0.6],
    [0.72, 0.72],
    [0.98, 0.72],
  ],
  entrepreneurship: [
    [0.06, 0.16],
    [0.32, 0.16],
    [0.48, 0.32],
    [0.86, 0.32],
    [0.98, 0.44],
  ],
  music: [
    [0.36, 0.98],
    [0.36, 0.7],
    [0.5, 0.56],
    [0.6, 0.56],
    [0.6, 0.02],
  ],
  local: [
    [0.02, 0.68],
    [0.3, 0.68],
    [0.46, 0.84],
    [0.76, 0.84],
    [0.9, 0.7],
  ],
  education: [
    [0.78, 0.02],
    [0.78, 0.44],
    [0.66, 0.56],
    [0.66, 0.9],
    [0.98, 0.9],
  ],
  gaming: [
    [0.14, 0.92],
    [0.46, 0.92],
    [0.6, 0.78],
    [0.98, 0.78],
  ],
};

/** Interchanges — where lines meet and, in the metaphor, where people do. */
const NODES: [number, number][] = [
  [0.54, 0.5],
  [0.6, 0.44],
  [0.6, 0.6],
  [0.66, 0.38],
  [0.5, 0.56],
  [0.66, 0.56],
  [0.74, 0.58],
  [0.4, 0.44],
  [0.46, 0.84],
];

/** The centre. One identity, connected across every environment. */
const FOCUS: [number, number] = [0.6, 0.5];

type Palette = {
  isDark: boolean;
  path: string;
  rule: string;
  node: string;
  nodeRing: string;
  lamp: string;
};

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  const ground = get("--bp-ground", "#101826");
  // Luminance of the ground tells us which theme is live without duplicating
  // the media-query logic here.
  const hex = ground.replace("#", "");
  const isDark =
    hex.length >= 6 &&
    parseInt(hex.slice(0, 2), 16) + parseInt(hex.slice(2, 4), 16) + parseInt(hex.slice(4, 6), 16) <
      330;

  return {
    isDark,
    path: get("--bp-path", "#3a4b69"),
    rule: get("--bp-rule", "#25324a"),
    node: get("--bp-node", "#161f30"),
    nodeRing: get("--bp-node-ring", "#9aa6b8"),
    lamp: get("--bp-accent", "#e8b368"),
  };
}

/** `#rrggbb` → `r, g, b` for use inside rgb(… / alpha). */
function rgbTriplet(hex: string): string {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return `${parseInt(full.slice(0, 2), 16)}, ${parseInt(full.slice(2, 4), 16)}, ${parseInt(
    full.slice(4, 6),
    16,
  )}`;
}

/** Total length of a polyline, and the point at distance `d` along it. */
function polylineLength(points: [number, number][], w: number, h: number): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(
      (points[i][0] - points[i - 1][0]) * w,
      (points[i][1] - points[i - 1][1]) * h,
    );
  }
  return total;
}

function pointAt(
  points: [number, number][],
  distance: number,
  w: number,
  h: number,
): [number, number] {
  let remaining = distance;
  for (let i = 1; i < points.length; i++) {
    const ax = points[i - 1][0] * w;
    const ay = points[i - 1][1] * h;
    const bx = points[i][0] * w;
    const by = points[i][1] * h;
    const seg = Math.hypot(bx - ax, by - ay);
    if (remaining <= seg) {
      const t = seg === 0 ? 0 : remaining / seg;
      return [ax + (bx - ax) * t, ay + (by - ay) * t];
    }
    remaining -= seg;
  }
  const last = points[points.length - 1];
  return [last[0] * w, last[1] * h];
}

export function PlazaField({
  className,
  /** When set, these communities stay lit and the rest recede. Used in Stage 4. */
  highlight,
  /** Decorative by default. Give it a label only if it carries meaning. */
  label,
}: {
  className?: string;
  highlight?: readonly CommunityId[];
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // The draw loop reads the current highlight every frame, so it needs a ref
  // rather than a dependency — re-running the effect would tear down and
  // restart the animation on each selection change. Assigning in an effect
  // rather than during render keeps the render pass pure.
  const highlightRef = useRef(highlight);
  useEffect(() => {
    highlightRef.current = highlight;
  }, [highlight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let palette = readPalette();
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let start: number | null = null;

    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(elapsed: number) {
      if (!context || width === 0 || height === 0) return;
      const active = highlightRef.current;
      const lamp = rgbTriplet(palette.lamp);

      context.clearRect(0, 0, width, height);

      // Paving grid — faint, and the only thing that reads as ground.
      context.strokeStyle = palette.rule;
      context.globalAlpha = palette.isDark ? 0.5 : 0.7;
      context.lineWidth = 1;
      const step = Math.max(width, height) / 14;
      context.beginPath();
      for (let x = 0; x <= width; x += step) {
        context.moveTo(Math.round(x) + 0.5, 0);
        context.lineTo(Math.round(x) + 0.5, height);
      }
      for (let y = 0; y <= height; y += step) {
        context.moveTo(0, Math.round(y) + 0.5);
        context.lineTo(width, Math.round(y) + 0.5);
      }
      context.stroke();
      context.globalAlpha = 1;

      // Community lines.
      context.lineJoin = "round";
      context.lineCap = "round";
      for (const community of COMMUNITIES) {
        const points = LINES[community.id];
        const dimmed = active && active.length > 0 && !active.includes(community.id);

        context.strokeStyle = community.fill;
        context.globalAlpha = dimmed ? 0.12 : palette.isDark ? 0.78 : 0.85;
        context.lineWidth = dimmed ? 1.5 : 3;
        context.beginPath();
        points.forEach(([nx, ny], i) => {
          const x = nx * width;
          const y = ny * height;
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
        context.stroke();
      }
      context.globalAlpha = 1;

      // Warm light gathering at the interchanges.
      context.globalCompositeOperation = "lighter";
      NODES.forEach(([nx, ny], i) => {
        const x = nx * width;
        const y = ny * height;
        const pulse = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(elapsed * 0.5 + i * 1.7);
        const radius = (palette.isDark ? 54 : 34) * (1 + pulse * 0.16);
        const strength = (palette.isDark ? 0.26 : 0.12) + pulse * (palette.isDark ? 0.14 : 0.05);

        const glow = context.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, `rgba(${lamp}, ${strength})`);
        glow.addColorStop(0.45, `rgba(${lamp}, ${strength * 0.28})`);
        glow.addColorStop(1, `rgba(${lamp}, 0)`);
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      });

      // The centre, lit brightest.
      const cx = FOCUS[0] * width;
      const cy = FOCUS[1] * height;
      const coreRadius = palette.isDark ? 96 : 62;
      const core = context.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
      core.addColorStop(0, `rgba(${lamp}, ${palette.isDark ? 0.4 : 0.2})`);
      core.addColorStop(0.35, `rgba(${lamp}, ${palette.isDark ? 0.16 : 0.07})`);
      core.addColorStop(1, `rgba(${lamp}, 0)`);
      context.fillStyle = core;
      context.beginPath();
      context.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      context.fill();
      context.globalCompositeOperation = "source-over";

      // People, moving. Slow enough to notice only on the second look.
      COMMUNITIES.forEach((community, i) => {
        const points = LINES[community.id];
        const dimmed = active && active.length > 0 && !active.includes(community.id);
        if (dimmed) return;

        const total = polylineLength(points, width, height);
        const speed = 22 + (i % 4) * 6;
        const offset = reduced ? total * (0.2 + i * 0.07) : (elapsed * speed + i * 140) % total;
        const [x, y] = pointAt(points, offset, width, height);

        context.fillStyle = community.fill;
        context.beginPath();
        context.arc(x, y, 3.2, 0, Math.PI * 2);
        context.fill();
      });

      // Interchange rings, drawn last so they sit above the lines.
      context.lineWidth = 2;
      context.strokeStyle = palette.nodeRing;
      context.fillStyle = palette.node;
      for (const [nx, ny] of NODES) {
        context.beginPath();
        context.arc(nx * width, ny * height, 6, 0, Math.PI * 2);
        context.fill();
        context.stroke();
      }

      // The identity at the centre — a ring around a solid core.
      context.beginPath();
      context.arc(cx, cy, 15, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = palette.nodeRing;
      context.beginPath();
      context.arc(cx, cy, 5, 0, Math.PI * 2);
      context.fill();
    }

    function loop(timestamp: number) {
      start ??= timestamp;
      draw((timestamp - start) / 1000);
      if (!reduced && visible) frame = requestAnimationFrame(loop);
    }

    function restart() {
      cancelAnimationFrame(frame);
      resize();
      if (reduced || !visible) draw(0);
      else frame = requestAnimationFrame(loop);
    }

    restart();

    const resizeObserver = new ResizeObserver(restart);
    resizeObserver.observe(canvas);

    // Stop animating off-screen. A canvas nobody is looking at should not be
    // costing a laptop battery for the length of a scroll.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) restart();
        else cancelAnimationFrame(frame);
      },
      { rootMargin: "120px" },
    );
    intersectionObserver.observe(canvas);

    // The palette is read from CSS, so both routes into a theme change have to
    // trigger a repaint: the toggle (an attribute) and the OS (a media query).
    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      restart();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      palette = readPalette();
      restart();
    };
    scheme.addEventListener("change", onScheme);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      scheme.removeEventListener("change", onScheme);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block h-full w-full", className)}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
