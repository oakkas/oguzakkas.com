import React, { useEffect, useRef } from 'react';

// A slowly turning 3D neural network drawn on a plain 2D canvas (no WebGL library).
// Its five layers are the stages from "How I work", and pulses of data flow through
// them from left to right. Pauses when off screen; draws one still frame for
// visitors who prefer reduced motion.

const LAYERS = [
  { label: 'Ingest', count: 7 },
  { label: 'Extract', count: 10 },
  { label: 'Train', count: 12 },
  { label: 'Deploy', count: 10 },
  { label: 'Monitor', count: 6 },
];
const LAYER_SPACING = 0.85;
const CAMERA_DISTANCE = 3.6;
const MAX_PULSES = 36;

type Point = { x: number; y: number; z: number };
type Node = Point & { flash: number };
type Pulse = { edge: number; progress: number; speed: number };
type Palette = { edge: string; node: string; pulse: string; label: string; glowNode: HTMLCanvasElement; glowPulse: HTMLCanvasElement };

// Seeded random numbers, so the network has the same shape on every visit
const seededRandom = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const buildNetwork = () => {
  const rand = seededRandom(7);
  const nodes: Node[] = [];
  const layerStart: number[] = [];
  LAYERS.forEach((layer, l) => {
    layerStart.push(nodes.length);
    const radius = 0.3 + Math.sqrt(layer.count) * 0.2;
    for (let i = 0; i < layer.count; i++) {
      // A golden-angle spiral spreads each layer's nodes evenly over a disc
      const r = radius * Math.sqrt((i + 0.5) / layer.count);
      const angle = i * 2.399963;
      nodes.push({ x: (l - (LAYERS.length - 1) / 2) * LAYER_SPACING, y: r * Math.sin(angle), z: r * Math.cos(angle), flash: 0 });
    }
  });

  const edges: { from: number; to: number }[] = [];
  const outgoing: number[][] = nodes.map(() => []);
  for (let l = 0; l < LAYERS.length - 1; l++) {
    for (let i = 0; i < LAYERS[l].count; i++) {
      const targets = Array.from({ length: LAYERS[l + 1].count }, (_, j) => layerStart[l + 1] + j);
      for (let k = 0; k < 3; k++) {
        const pick = k + Math.floor(rand() * (targets.length - k));
        [targets[k], targets[pick]] = [targets[pick], targets[k]];
        outgoing[layerStart[l] + i].push(edges.length);
        edges.push({ from: layerStart[l] + i, to: targets[k] });
      }
    }
  }
  return { nodes, edges, outgoing, layerStart };
};

const makeGlow = (rgb: string) => {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  const ctx = sprite.getContext('2d')!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, `rgba(${rgb}, 1)`);
  gradient.addColorStop(0.25, `rgba(${rgb}, 0.55)`);
  gradient.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return sprite;
};

const makePalette = (dark: boolean): Palette => {
  const colors = dark
    ? { edge: '148, 163, 184', node: '56, 189, 248', pulse: '52, 211, 153', label: '148, 163, 184' }
    : { edge: '71, 85, 105', node: '2, 132, 199', pulse: '16, 185, 129', label: '71, 85, 105' };
  return { ...colors, glowNode: makeGlow(colors.node), glowPulse: makeGlow(colors.pulse) };
};

const NeuralScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { nodes, edges, outgoing, layerStart } = buildNetwork();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dark = document.documentElement.classList.contains('dark');
    let palette = makePalette(dark);
    let width = 0;
    let height = 0;
    let time = 1.2;
    let spawnIn = 0;
    let frame = 0;
    let last = 0;
    let onScreen = true;
    const pulses: Pulse[] = [];
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const projected = nodes.map(() => ({ x: 0, y: 0, depth: 0, scale: 1 }));

    const project = (p: Point, cosY: number, sinY: number, cosX: number, sinX: number, out: { x: number; y: number; depth: number; scale: number }) => {
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;
      const y1 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;
      const unit = Math.min(width / 5, height / 3.1);
      out.scale = CAMERA_DISTANCE / (CAMERA_DISTANCE + z2);
      out.x = width / 2 + x1 * unit * out.scale;
      out.y = height / 2 + y1 * unit * out.scale;
      out.depth = Math.min(1, Math.max(0, (z2 + 1.2) / 2.4)); // 0 = nearest, 1 = farthest
      return out;
    };

    const draw = () => {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const angleY = Math.sin(time * 0.22) * 0.55 + pointer.x * 0.45;
      const angleX = 0.32 + Math.sin(time * 0.17) * 0.1 + pointer.y * 0.25;
      const cosY = Math.cos(angleY), sinY = Math.sin(angleY), cosX = Math.cos(angleX), sinX = Math.sin(angleX);
      nodes.forEach((node, i) => project(node, cosY, sinY, cosX, sinX, projected[i]));

      ctx.lineWidth = 1;
      for (const edge of edges) {
        const a = projected[edge.from], b = projected[edge.to];
        ctx.strokeStyle = `rgba(${palette.edge}, ${(0.08 + 0.22 * (1 - (a.depth + b.depth) / 2)).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const pulse of pulses) {
        const a = projected[edges[pulse.edge].from], b = projected[edges[pulse.edge].to];
        const x = a.x + (b.x - a.x) * pulse.progress;
        const y = a.y + (b.y - a.y) * pulse.progress;
        const size = 14 * (a.scale + (b.scale - a.scale) * pulse.progress);
        ctx.globalAlpha = 0.9;
        ctx.drawImage(palette.glowPulse, x - size / 2, y - size / 2, size, size);
      }

      const order = projected.map((_, i) => i).sort((i, j) => projected[j].depth - projected[i].depth);
      for (const i of order) {
        const p = projected[i];
        const flash = nodes[i].flash;
        if (flash > 0.01) {
          const size = (18 + 22 * flash) * p.scale;
          ctx.globalAlpha = flash * 0.9;
          ctx.drawImage(palette.glowNode, p.x - size / 2, p.y - size / 2, size, size);
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(${palette.node}, ${(0.45 + 0.55 * (1 - p.depth)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (2.1 + 1.6 * flash) * p.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = '600 10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgb(${palette.label})`;
      LAYERS.forEach((layer, l) => {
        const members = projected.slice(layerStart[l], layerStart[l] + layer.count);
        const x = members.reduce((sum, p) => sum + p.x, 0) / members.length;
        const y = Math.max(...members.map(p => p.y)) + 16;
        const depth = members.reduce((sum, p) => sum + p.depth, 0) / members.length;
        ctx.globalAlpha = 0.6 + 0.35 * (1 - depth);
        ctx.fillText(layer.label.toUpperCase(), x, y);
      });
      ctx.globalAlpha = 1;
    };

    const update = (dt: number) => {
      time += dt;
      pointer.x += (pointer.targetX - pointer.x) * Math.min(1, dt * 3);
      pointer.y += (pointer.targetY - pointer.y) * Math.min(1, dt * 3);

      spawnIn -= dt;
      if (spawnIn <= 0 && pulses.length < MAX_PULSES) {
        spawnIn = 0.12;
        const start = layerStart[0] + Math.floor(Math.random() * LAYERS[0].count);
        const choices = outgoing[start];
        pulses.push({ edge: choices[Math.floor(Math.random() * choices.length)], progress: 0, speed: 0.9 + Math.random() * 0.6 });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.progress += dt * pulse.speed;
        if (pulse.progress < 1) continue;
        const reached = edges[pulse.edge].to;
        nodes[reached].flash = 1;
        const next = outgoing[reached];
        if (next.length) {
          pulse.edge = next[Math.floor(Math.random() * next.length)];
          pulse.progress = 0;
        } else {
          pulses.splice(i, 1);
        }
      }
      for (const node of nodes) node.flash = Math.max(0, node.flash - dt * 2.2);
    };

    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      update(dt);
      draw();
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduceMotion || frame || !onScreen || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / rect.width));
      pointer.targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height / 2) / rect.height));
    };
    const handleVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    intersectionObserver.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains('dark');
      if (nowDark === dark) return;
      dark = nowDark;
      palette = makePalette(dark);
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('pointermove', handlePointer);
    document.addEventListener('visibilitychange', handleVisibility);

    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" />;
};

export default NeuralScene;
