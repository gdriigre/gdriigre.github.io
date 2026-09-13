'use client';

import { useEffect, useRef, useState } from 'react';
import { easeGaze, gazeTarget, type GazePoint } from './gaze-math';

const PORTRAIT = '/images/character-gaze.png';
// Image-space geometry for this portrait: the gaze origin sits between the eyes.
const FACE_CENTER = { x: 488.5, y: 518 };

const vertexSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentSource = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_image;
uniform vec2 u_view;
uniform vec2 u_image_size;
uniform vec2 u_head;
uniform vec2 u_gaze;

float edgeDistance(vec2 p, vec2 a, vec2 b) {
  vec2 edge = b - a;
  vec2 delta = p - a;
  return (edge.x * delta.y - edge.y * delta.x) / length(edge);
}

float eyeOpening(vec2 p, bool right) {
  // Convex contours sit just inside the original eyelids, in source pixels.
  // Moving irises are clipped here; the lid, lashes and skin never slide.
  float d = 1000.0;
  if (right) {
    d = min(d, edgeDistance(p, vec2(527, 510), vec2(531, 495)));
    d = min(d, edgeDistance(p, vec2(531, 495), vec2(539, 484)));
    d = min(d, edgeDistance(p, vec2(539, 484), vec2(552, 477)));
    d = min(d, edgeDistance(p, vec2(552, 477), vec2(565, 474)));
    d = min(d, edgeDistance(p, vec2(565, 474), vec2(580, 477)));
    d = min(d, edgeDistance(p, vec2(580, 477), vec2(591, 483)));
    d = min(d, edgeDistance(p, vec2(591, 483), vec2(596, 491)));
    d = min(d, edgeDistance(p, vec2(596, 491), vec2(592, 502)));
    d = min(d, edgeDistance(p, vec2(592, 502), vec2(583, 512)));
    d = min(d, edgeDistance(p, vec2(583, 512), vec2(570, 522)));
    d = min(d, edgeDistance(p, vec2(570, 522), vec2(554, 526)));
    d = min(d, edgeDistance(p, vec2(554, 526), vec2(540, 527)));
    d = min(d, edgeDistance(p, vec2(540, 527), vec2(529, 524)));
    d = min(d, edgeDistance(p, vec2(529, 524), vec2(527, 510)));
  } else {
    d = min(d, edgeDistance(p, vec2(377, 542), vec2(381, 531)));
    d = min(d, edgeDistance(p, vec2(381, 531), vec2(388, 522)));
    d = min(d, edgeDistance(p, vec2(388, 522), vec2(399, 516)));
    d = min(d, edgeDistance(p, vec2(399, 516), vec2(413, 513)));
    d = min(d, edgeDistance(p, vec2(413, 513), vec2(427, 516)));
    d = min(d, edgeDistance(p, vec2(427, 516), vec2(440, 524)));
    d = min(d, edgeDistance(p, vec2(440, 524), vec2(448, 534)));
    d = min(d, edgeDistance(p, vec2(448, 534), vec2(452, 545)));
    d = min(d, edgeDistance(p, vec2(452, 545), vec2(442, 553)));
    d = min(d, edgeDistance(p, vec2(442, 553), vec2(430, 559)));
    d = min(d, edgeDistance(p, vec2(430, 559), vec2(416, 562)));
    d = min(d, edgeDistance(p, vec2(416, 562), vec2(402, 563)));
    d = min(d, edgeDistance(p, vec2(402, 563), vec2(389, 559)));
    d = min(d, edgeDistance(p, vec2(389, 559), vec2(381, 553)));
    d = min(d, edgeDistance(p, vec2(381, 553), vec2(377, 542)));
  }
  return smoothstep(0.0, 1.0, d);
}

vec4 lookingEye(vec4 original, vec2 pixel, vec2 direction, bool right) {
  vec2 center = right ? vec2(556.5, 500.5) : vec2(420.5, 537.0);
  vec2 radius = vec2(24.0, 25.5);
  if (length(pixel - center) > 48.0 || length(direction) < 0.0001) return original;
  vec2 offset = direction * vec2(10.0, 6.0);
  float oldIris = 1.0 - smoothstep(1.10, 1.22, length((pixel - center) / radius));
  float newIris = 1.0 - smoothstep(0.95, 1.01, length((pixel - center - offset) / radius));
  vec2 whiteLeft = right ? vec2(533.0, 514.0) : vec2(390.0, 547.0);
  vec2 whiteRight = right ? vec2(587.0, 493.0) : vec2(447.0, 541.0);
  vec4 sclera = mix(texture2D(u_image, whiteLeft / u_image_size), texture2D(u_image, whiteRight / u_image_size), smoothstep(-30.0, 30.0, pixel.x - center.x));
  // Move each iris as a solid texture, retaining its round shape and highlight.
  vec4 cleanEye = mix(original, sclera, oldIris);
  vec4 iris = texture2D(u_image, (pixel - offset) / u_image_size);
  vec4 eye = mix(cleanEye, iris, newIris);
  return mix(original, eye, eyeOpening(pixel, right) * smoothstep(0.0, 0.06, length(direction)));
}

float fingerMask(vec2 pixel, vec2 start, vec2 end, float radius) {
  vec2 segment = end - start;
  float along = clamp(dot(pixel - start, segment) / dot(segment, segment), 0.0, 1.0);
  float distance = length(pixel - start - along * segment);
  return 1.0 - smoothstep(radius, radius + 9.0, distance);
}

float headMask(vec2 pixel) {
  // The hat, hair, face and eyes share one rigid motion. Only the neck and
  // surrounding background blend back to the original, stationary picture.
  float silhouette = 1.0 - smoothstep(1.0, 1.16, length((pixel - vec2(490.0, 410.0)) / vec2(310.0, 305.0)));
  float neck = 1.0 - smoothstep(625.0, 695.0, pixel.y);
  // The raised peace-sign fingers overlap the head; keep them anchored.
  float fingers = max(
    fingerMask(pixel, vec2(318.0, 576.0), vec2(317.0, 653.0), 17.0),
    fingerMask(pixel, vec2(266.0, 582.0), vec2(304.0, 641.0), 16.0)
  );
  float palm = (1.0 - smoothstep(339.0, 365.0, pixel.x)) * smoothstep(629.0, 653.0, pixel.y);
  return silhouette * neck * (1.0 - max(fingers, palm));
}

void main() {
  // Match the existing 155%-wide image crop, using top-left image coordinates.
  vec2 screen = vec2(v_uv.x, 1.0 - v_uv.y) * u_view;
  float imageWidth = u_view.x * 1.55;
  vec2 imageSize = vec2(imageWidth, imageWidth * u_image_size.y / u_image_size.x);
  vec2 imageOffset = vec2((u_view.x - imageWidth) * 0.5, -0.09 * u_view.y);
  vec2 uv = (screen - imageOffset) / imageSize;
  vec2 pixel = uv * u_image_size;
  // At full reach the tilt is only 1.26 degrees; vertical travel is about
  // 2.5 display pixels on desktop. Inverse sampling preserves facial geometry.
  vec2 pivot = vec2(515.0, 668.0);
  float angle = u_head.x * 0.022;
  float c = cos(angle);
  float s = sin(angle);
  vec2 relative = pixel - pivot - u_head * vec2(5.0, 6.0);
  vec2 rotated = vec2(c * relative.x + s * relative.y, -s * relative.x + c * relative.y);
  vec2 source = mix(pixel, pivot + rotated, headMask(pixel));
  // The pupil movement is expressed in the turned head's local coordinates.
  vec2 gaze = vec2(c * u_gaze.x + s * u_gaze.y, -s * u_gaze.x + c * u_gaze.y);
  vec4 color = texture2D(u_image, clamp(source / u_image_size, 0.0, 1.0));
  color = lookingEye(color, source, gaze, false);
  gl_FragColor = lookingEye(color, source, gaze, true);
}`;

export function GazePortrait() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;

    let disposed = false;
    let loaded = false;
    let visible = true;
    let animation = 0;
    let lastTime = 0;
    let returnTimer: ReturnType<typeof setTimeout> | undefined;
    let touching = false;
    let bounds = frame.getBoundingClientRect();
    let current: GazePoint = { x: 0, y: 0 };
    let eyes: GazePoint = { x: 0, y: 0 };
    let target: GazePoint = { x: 0, y: 0 };
    let lastPointer: GazePoint | null = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shaders: WebGLShader[] = [];

    function compile(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return gl!.getShaderParameter(shader, gl!.COMPILE_STATUS) ? shader : null;
    }

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const highPrecision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    const fragment = compile(gl.FRAGMENT_SHADER, highPrecision?.precision ? fragmentSource : fragmentSource.replace('highp', 'mediump'));
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      shaders.forEach((shader) => gl.deleteShader(shader));
      if (program) gl.deleteProgram(program);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }

    // This is the WebGL API, not a React hook.
    // oxlint-disable-next-line react/react-compiler
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    if (!buffer || !texture) {
      if (buffer) gl.deleteBuffer(buffer);
      if (texture) gl.deleteTexture(texture);
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const viewUniform = gl.getUniformLocation(program, 'u_view');
    const imageSizeUniform = gl.getUniformLocation(program, 'u_image_size');
    const headUniform = gl.getUniformLocation(program, 'u_head');
    const gazeUniform = gl.getUniformLocation(program, 'u_gaze');
    gl.uniform1i(gl.getUniformLocation(program, 'u_image'), 0);

    const portrait = new window.Image();
    portrait.decoding = 'async';

    function draw() {
      if (!loaded || disposed || gl!.isContextLost()) return;
      gl!.uniform2f(viewUniform, bounds.width, bounds.height);
      gl!.uniform2f(headUniform, current.x, current.y);
      gl!.uniform2f(gazeUniform, eyes.x, eyes.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    }

    function animate(time: number) {
      animation = 0;
      if (!loaded || disposed || !visible || document.hidden) return;
      const elapsed = lastTime ? time - lastTime : 16;
      eyes = easeGaze(eyes, target, elapsed, 65);
      current = easeGaze(current, target, elapsed);
      lastTime = time;
      draw();
      if (Math.max(Math.hypot(current.x - target.x, current.y - target.y), Math.hypot(eyes.x - target.x, eyes.y - target.y)) > 0.001) {
        animation = requestAnimationFrame(animate);
      } else {
        current = { ...target };
        eyes = { ...target };
        lastTime = 0;
        draw();
      }
    }

    function schedule() {
      if (!animation && loaded && visible && !document.hidden && !disposed) {
        animation = requestAnimationFrame(animate);
      }
    }

    function updateTarget(pointer: GazePoint) {
      if (reducedMotion.matches || !visible || !bounds.width) return;
      const imageWidth = bounds.width * 1.55;
      const imageScale = imageWidth / (portrait.naturalWidth || 1024);
      const eyeCenter = {
        x: bounds.left + (bounds.width - imageWidth) * 0.5 + FACE_CENTER.x * imageScale,
        y: bounds.top - bounds.height * 0.09 + FACE_CENTER.y * imageScale,
      };
      target = gazeTarget(pointer, eyeCenter, bounds.width, bounds.height);
      lastPointer = pointer;
      schedule();
    }

    function reset() {
      clearTimeout(returnTimer);
      touching = false;
      lastPointer = null;
      target = { x: 0, y: 0 };
      schedule();
    }

    function measure() {
      bounds = frame!.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(bounds.height * ratio));
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
        gl!.viewport(0, 0, width, height);
      }
      if (lastPointer) updateTarget(lastPointer);
      draw();
    }

    function move(event: PointerEvent) {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen' || touching) {
        updateTarget({ x: event.clientX, y: event.clientY });
      }
    }

    function press(event: PointerEvent) {
      if (event.pointerType === 'mouse' || !frame!.contains(event.target as Node)) return;
      clearTimeout(returnTimer);
      touching = true;
      updateTarget({ x: event.clientX, y: event.clientY });
    }

    function release(event: PointerEvent) {
      if (event.pointerType === 'mouse' || !touching) return;
      touching = false;
      clearTimeout(returnTimer);
      returnTimer = setTimeout(reset, 650);
    }

    function leave(event: PointerEvent) {
      // Touch release also emits pointerleave; let its return timer finish.
      if (event.pointerType !== 'touch') reset();
    }

    function stop() {
      clearTimeout(returnTimer);
      cancelAnimationFrame(animation);
      animation = 0;
      lastTime = 0;
      current = { x: 0, y: 0 };
      eyes = { x: 0, y: 0 };
      target = { x: 0, y: 0 };
      lastPointer = null;
      touching = false;
    }

    function visibilityChange() {
      if (document.hidden) stop();
      else { measure(); schedule(); }
    }

    function motionPreferenceChange() {
      if (reducedMotion.matches) { stop(); draw(); }
    }

    function contextLost(event: Event) {
      event.preventDefault();
      stop();
      loaded = false;
      setReady(false);
    }

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(frame);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { measure(); schedule(); }
      else stop();
    });
    intersection.observe(frame);

    portrait.onload = () => {
      if (disposed || gl.isContextLost()) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, portrait);
      gl.uniform2f(imageSizeUniform, portrait.naturalWidth, portrait.naturalHeight);
      loaded = true;
      measure();
      setReady(true);
      schedule();
    };
    portrait.src = PORTRAIT;

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', press, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointercancel', reset, { passive: true });
    window.addEventListener('blur', reset);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibilityChange);
    reducedMotion.addEventListener('change', motionPreferenceChange);
    canvas.addEventListener('webglcontextlost', contextLost);

    return () => {
      disposed = true;
      stop();
      clearTimeout(returnTimer);
      portrait.onload = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', reset);
      window.removeEventListener('blur', reset);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibilityChange);
      reducedMotion.removeEventListener('change', motionPreferenceChange);
      canvas.removeEventListener('webglcontextlost', contextLost);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
    };
  }, []);

  return (
    <div ref={frameRef} className="portrait-frame gaze-portrait">
      {/* Keep the unmodified image and canvas on the same calibrated source pixels. */}
      {/* oxlint-disable-next-line nextjs/no-img-element */}
      <img className="portrait-source" src={PORTRAIT} alt="谢达的蓝帽动漫形象，双眼睁开微笑比耶" width="1024" height="1536" fetchPriority="high" draggable={false} />
      <canvas ref={canvasRef} className={`gaze-canvas${ready ? ' is-ready' : ''}`} aria-hidden="true" />
    </div>
  );
}
