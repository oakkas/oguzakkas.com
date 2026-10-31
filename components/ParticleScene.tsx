import React, { useEffect, useRef } from 'react';
import { LAYERS, buildNetwork } from './NeuralScene';

// The hero headline, acted out on the GPU: thousands of grey particles churn in a
// messy cloud, then fly into the five-layer network from "How I work", one layer
// after another from left to right, while pulses of data run along its edges.
// Plain WebGL, no library. The cloud fills the canvas (the whole hero card); the
// network settles into the box of `anchorRef`. Scrolling the card away scatters the
// network again, and the mouse pushes particles aside. Visitors who prefer reduced
// motion get one still frame of the finished network. Calls `onFail` when WebGL
// isn't available, so the page can fall back to the 2D NeuralScene.

const CAMERA_DISTANCE = 3.6;
const FLOATS = 13; // per particle: cloud xyz, edge start xyz, edge end xyz, seed xyzw
const JOIN_TIME = 0.42; // share of the morph each particle takes to fly into place
const INTRO_DELAY = 1.3; // the cloud churns this long before the network starts to form
const INTRO_DURATION = 3.6;

const VERTEX = `
attribute vec3 aCloud;
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec4 aSeed; // x: start along the edge, y: pulse phase + 1 on edges (0 on nodes), z: when it joins, w: random

uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uTime;
uniform float uMorph;
uniform vec2 uAngles;
uniform vec3 uNetwork; // centre x, y and unit length, in CSS pixels
uniform vec4 uCloudBox; // centre x, y and half size x, y
uniform vec3 uPointer; // x, y and strength
uniform vec3 uCloudColor;
uniform vec3 uNodeColor;
uniform vec3 uEdgeColor;
uniform vec3 uPulseColor;
uniform vec4 uAlpha; // cloud, node, edge, pulse

varying vec4 vColor;

vec3 turn(vec3 p, vec2 a) {
  float cy = cos(a.x), sy = sin(a.x), cx = cos(a.y), sx = sin(a.y);
  float x1 = p.x * cy + p.z * sy;
  float z1 = -p.x * sy + p.z * cy;
  return vec3(x1, p.y * cx - z1 * sx, p.y * sx + z1 * cx);
}

void main() {
  bool edge = aSeed.y > 0.5;
  float along = edge ? fract(aSeed.x + uTime * 0.04) : 0.0;
  vec3 net = turn(mix(aFrom, aTo, along), uAngles);
  float netScale = ${CAMERA_DISTANCE.toFixed(1)} / (${CAMERA_DISTANCE.toFixed(1)} + net.z);
  vec2 netPos = uNetwork.xy + net.xy * uNetwork.z * netScale;

  // The messy data: a tilted vortex that turns faster near its middle, shearing clumps into streaks
  vec3 c = aCloud;
  float spin = uTime * (0.35 + 0.1 * aSeed.w) / (0.35 + length(c.xz));
  c.xz = vec2(c.x * cos(spin) - c.z * sin(spin), c.x * sin(spin) + c.z * cos(spin));
  c.y += 0.12 * sin(uTime * 0.8 + aSeed.w * 6.2832 + c.x * 2.5);
  vec3 cloud = turn(c, vec2(0.0, 0.5));
  float cloudScale = ${CAMERA_DISTANCE.toFixed(1)} / (${CAMERA_DISTANCE.toFixed(1)} + cloud.z);
  vec2 cloudPos = uCloudBox.xy + cloud.xy * uCloudBox.zw * cloudScale;

  // Fly from the cloud into the network on a curved path
  float t = smoothstep(aSeed.z, aSeed.z + ${JOIN_TIME}, uMorph);
  vec2 path = netPos - cloudPos;
  vec2 pos = mix(cloudPos, netPos, t) + vec2(-path.y, path.x) * (aSeed.w - 0.5) * 0.5 * sin(3.1416 * t);

  vec2 away = pos - uPointer.xy;
  pos += away / (length(away) + 1.0) * uPointer.z * 36.0 * exp(-dot(away, away) / 9000.0);

  float near = 1.0 - clamp((mix(cloud.z, net.z, t) + 1.2) / 2.4, 0.0, 1.0);
  float packet = fract(uTime * 0.45 + aSeed.y);
  float pulse = edge ? exp(-pow((along - packet) * 16.0, 2.0)) : 0.0;
  vec3 color = edge ? mix(uEdgeColor, uPulseColor, pulse) : uNodeColor;
  float alpha = edge ? mix(uAlpha.z, uAlpha.w, pulse) : uAlpha.y;
  float size = edge ? 1.5 + 2.4 * pulse : 2.5;
  float flight = sin(3.1416 * t); // particles glow brighter while they fly

  vColor = vec4(mix(uCloudColor, color, t), mix(uAlpha.x, alpha, t) * (0.5 + 0.5 * near) * (1.0 + flight));
  gl_PointSize = mix(2.3, size, t) * (1.0 + 0.4 * flight) * mix(cloudScale, netScale, t) * uPixelRatio;
  gl_Position = vec4(pos / uResolution * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
}`;

const FRAGMENT = `
precision mediump float;
varying vec4 vColor;
void main() {
  float a = vColor.a * smoothstep(0.5, 0.1, length(gl_PointCoord - 0.5));
  gl_FragColor = vec4(vColor.rgb * a, a);
}`;

// Additive glow on the dark theme; ordinary blending on the light one, where glow would vanish into white
const THEMES = {
  dark: { cloud: [148, 163, 184], node: [56, 189, 248], edge: [148, 163, 184], pulse: [52, 211, 153], alpha: [0.5, 0.5, 0.16, 0.9] },
  light: { cloud: [100, 116, 139], node: [2, 132, 199], edge: [100, 116, 139], pulse: [16, 185, 129], alpha: [0.42, 0.55, 0.22, 0.9] },
};

const gauss = () => Math.sqrt(-2 * Math.log(Math.random() || 1e-6)) * Math.cos(2 * Math.PI * Math.random());
const ease = (t: number) => t * t * (3 - 2 * t);

// Where each particle starts: most in clumps stretched along the vortex, the rest loose
const cloudPoint = (clumps: number[][]) => {
  if (Math.random() < 0.35) return [gauss() * 0.7, gauss() * 0.35, gauss() * 0.7];
  const [r, angle, y] = clumps[Math.floor(Math.random() * clumps.length)];
  const a = angle + gauss() * 0.22 / r;
  const d = r + gauss() * 0.05;
  return [Math.cos(a) * d, y + gauss() * 0.05, Math.sin(a) * d];
};

// Each node becomes a dense ball of particles and each edge a dotted line of them
const buildParticles = (count: number) => {
  const { nodes, edges } = buildNetwork();
  const clumps = Array.from({ length: 28 }, () => [0.15 + Math.sqrt(Math.random()) * 1.1, Math.random() * Math.PI * 2, gauss() * 0.22]);
  const perNode = Math.floor((count * 0.35) / nodes.length);
  const perEdge = Math.floor((count - perNode * nodes.length) / edges.length);
  const total = perNode * nodes.length + perEdge * edges.length;
  const data = new Float32Array(total * FLOATS);
  let o = 0;
  const put = (from: (typeof nodes)[0], to: (typeof nodes)[0], spread: number, along: number, phase: number, layer: number) => {
    data.set(cloudPoint(clumps), o);
    const jx = gauss() * spread, jy = gauss() * spread, jz = gauss() * spread;
    data.set([from.x + jx, from.y + jy, from.z + jz, to.x + jx, to.y + jy, to.z + jz], o + 3);
    data.set([along, phase, (layer / (LAYERS.length - 1)) * 0.5 + Math.random() * 0.08, Math.random()], o + 9);
    o += FLOATS;
  };
  nodes.forEach(node => {
    for (let i = 0; i < perNode; i++) put(node, node, 0.04, 0, 0, node.layer);
  });
  edges.forEach(edge => {
    const phase = 1 + Math.random();
    for (let i = 0; i < perEdge; i++) put(nodes[edge.from], nodes[edge.to], 0.006, Math.random(), phase, nodes[edge.from].layer + 0.5);
  });
  return { data, total, nodes };
};

const compile = (gl: WebGLRenderingContext) => {
  const shader = (type: number, source: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
};

const ParticleScene: React.FC<{ anchorRef: React.RefObject<HTMLElement | null>; onFail: () => void }> = ({ anchorRef, onFail }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Set up in a task of its own after React's first render, so it doesn't lengthen that one
    const setUp = () => {
      const canvas = canvasRef.current;
      const anchor = anchorRef.current;
      const gl = canvas?.getContext('webgl', { antialias: false, premultipliedAlpha: true });
      const program = gl && compile(gl);
      if (!canvas || !anchor || !gl || !program) {
        onFail();
        return;
      }

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const { data, total, nodes } = buildParticles(canvas.clientWidth < 768 ? 9000 : 20000);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      ([['aCloud', 3, 0], ['aFrom', 3, 3], ['aTo', 3, 6], ['aSeed', 4, 9]] as const).forEach(([name, size, offset]) => {
        const location = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, FLOATS * 4, offset * 4);
      });
      const uniform = (name: string) => gl.getUniformLocation(program, name);
      const u = {
        resolution: uniform('uResolution'), pixelRatio: uniform('uPixelRatio'), time: uniform('uTime'), morph: uniform('uMorph'),
        angles: uniform('uAngles'), network: uniform('uNetwork'), cloudBox: uniform('uCloudBox'), pointer: uniform('uPointer'),
        cloudColor: uniform('uCloudColor'), nodeColor: uniform('uNodeColor'), edgeColor: uniform('uEdgeColor'),
        pulseColor: uniform('uPulseColor'), alpha: uniform('uAlpha'),
      };

      const applyTheme = () => {
        const dark = document.documentElement.classList.contains('dark');
        const theme = dark ? THEMES.dark : THEMES.light;
        const rgb = (c: number[]) => c.map(v => v / 255) as [number, number, number];
        gl.uniform3f(u.cloudColor, ...rgb(theme.cloud));
        gl.uniform3f(u.nodeColor, ...rgb(theme.node));
        gl.uniform3f(u.edgeColor, ...rgb(theme.edge));
        gl.uniform3f(u.pulseColor, ...rgb(theme.pulse));
        gl.uniform4f(u.alpha, ...(theme.alpha as [number, number, number, number]));
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, dark ? gl.ONE : gl.ONE_MINUS_SRC_ALPHA);
      };

      let width = 0;
      let height = 0;
      const network = { x: 0, y: 0, unit: 0 };
      let time = 1.2;
      let intro = reduceMotion ? 1 : 0;
      let introClock = 0;
      let scatter = 1; // 1 = assembled, eased toward what the scroll position asks for
      let frame = 0;
      let last = 0;
      let onScreen = true;
      const pointer = { x: 0, y: 0, tiltX: 0, tiltY: 0, strength: 0, targetX: 0, targetY: 0, targetStrength: 0 };

      const resize = () => {
        const box = canvas.getBoundingClientRect();
        const area = anchor.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = box.width;
        height = box.height;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        network.unit = Math.min(area.width / 5, area.height / 2.9);
        // A little left of the box's centre, so the swaying network clears the card's edge
        network.x = area.left - box.left + area.width / 2 - network.unit * 0.25;
        network.y = area.top - box.top + area.height / 2;
        gl.uniform2f(u.resolution, width, height);
        gl.uniform1f(u.pixelRatio, dpr);
        gl.uniform3f(u.network, network.x, network.y, network.unit);
        // The cloud sits between the card's centre and the network, mostly clear of the headline
        gl.uniform4f(u.cloudBox, width / 2 + (network.x - width / 2) * 0.65, (height / 2 + network.y) / 2, width * 0.32, height * 0.4);
        draw();
      };

      const morphOf = (layer: number, morph: number) => {
        const start = (layer / (LAYERS.length - 1)) * 0.5 + 0.04;
        return ease(Math.min(1, Math.max(0, (morph - start) / JOIN_TIME)));
      };

      const draw = () => {
        if (!width || !height) return;
        const morph = Math.min(intro, scatter);
        const angleY = Math.sin(time * 0.22) * 0.55 + pointer.tiltX * 0.45;
        const angleX = 0.32 + Math.sin(time * 0.17) * 0.1 + pointer.tiltY * 0.25;
        gl.uniform1f(u.time, time);
        gl.uniform1f(u.morph, morph);
        gl.uniform2f(u.angles, angleY, angleX);
        gl.uniform3f(u.pointer, pointer.x, pointer.y, pointer.strength);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, total);

        // Layer labels, placed under each layer the same way the shader places the nodes
        const cy = Math.cos(angleY), sy = Math.sin(angleY), cx = Math.cos(angleX), sx = Math.sin(angleX);
        LAYERS.forEach((layer, l) => {
          const label = labelRefs.current[l];
          if (!label) return;
          let sumX = 0;
          let maxY = -Infinity;
          nodes.forEach(node => {
            if (node.layer !== l) return;
            const x1 = node.x * cy + node.z * sy;
            const z1 = -node.x * sy + node.z * cy;
            const scale = CAMERA_DISTANCE / (CAMERA_DISTANCE + node.y * sx + z1 * cx);
            sumX += network.x + x1 * network.unit * scale;
            maxY = Math.max(maxY, network.y + (node.y * cx - z1 * sx) * network.unit * scale);
          });
          label.style.transform = `translate(${(sumX / layer.count).toFixed(1)}px, ${(maxY + 12).toFixed(1)}px) translateX(-50%)`;
          label.style.opacity = (0.85 * morphOf(l, morph)).toFixed(2);
        });
      };

      const update = (dt: number) => {
        time += dt;
        introClock += dt;
        intro = Math.min(1, Math.max(0, (introClock - INTRO_DELAY) / INTRO_DURATION));
        // Scrolling the network up past the middle of the screen scatters it back into the cloud
        const area = anchor.getBoundingClientRect();
        const fold = window.innerHeight * 0.6;
        const gone = (fold - (area.top + area.height / 2)) / fold;
        const target = 1 - ease(Math.min(1, Math.max(0, (gone - 0.1) / 0.8)));
        scatter += (target - scatter) * Math.min(1, dt * 3);
        const k = Math.min(1, dt * 6);
        pointer.x += (pointer.targetX - pointer.x) * k;
        pointer.y += (pointer.targetY - pointer.y) * k;
        pointer.strength += (pointer.targetStrength - pointer.strength) * Math.min(1, dt * 4);
        const tiltX = pointer.targetStrength ? (pointer.targetX - width / 2) / width : 0;
        const tiltY = pointer.targetStrength ? (pointer.targetY - height / 2) / height : 0;
        pointer.tiltX += (tiltX - pointer.tiltX) * Math.min(1, dt * 3);
        pointer.tiltY += (tiltY - pointer.tiltY) * Math.min(1, dt * 3);
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

      const handlePointer = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        const box = canvas.getBoundingClientRect();
        pointer.targetX = event.clientX - box.left;
        pointer.targetY = event.clientY - box.top;
        pointer.targetStrength = pointer.targetX >= 0 && pointer.targetX <= box.width && pointer.targetY >= 0 && pointer.targetY <= box.height ? 1 : 0;
      };
      const handleVisibility = () => (document.hidden ? stop() : start());
      const handleContextLost = (event: Event) => {
        event.preventDefault();
        stop();
        onFail();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      resizeObserver.observe(anchor);
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      });
      intersectionObserver.observe(canvas);
      const themeObserver = new MutationObserver(() => {
        applyTheme();
        draw();
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      window.addEventListener('pointermove', handlePointer);
      document.addEventListener('visibilitychange', handleVisibility);
      canvas.addEventListener('webglcontextlost', handleContextLost);

      applyTheme();
      resize();
      start();

      return () => {
        stop();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        themeObserver.disconnect();
        window.removeEventListener('pointermove', handlePointer);
        document.removeEventListener('visibilitychange', handleVisibility);
        canvas.removeEventListener('webglcontextlost', handleContextLost);
      };
    };
    let tearDown: (() => void) | undefined;
    const timer = setTimeout(() => {
      tearDown = setUp();
    });
    return () => {
      clearTimeout(timer);
      tearDown?.();
    };
  }, [anchorRef, onFail]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
      {LAYERS.map((layer, l) => (
        <span
          key={layer.label}
          ref={el => { labelRefs.current[l] = el; }}
          className="absolute left-0 top-0 text-[10px] font-semibold uppercase tracking-wider text-slate-500 opacity-0 dark:text-slate-400"
        >
          {layer.label}
        </span>
      ))}
    </>
  );
};

export default ParticleScene;
