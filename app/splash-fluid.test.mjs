import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startSplash } from './splash-fluid.js';

// Exercise GPU ownership and real event handlers without needing a browser/GPU.
function setup(t, { supported = true, compile = true, coarse = false } = {}) {
  const win = new EventTarget();
  const doc = new EventTarget();
  const canvas = new EventTarget();
  const resources = new Set();
  const frames = new Map();
  let id = 0;
  let draws = 0;
  let now = 0;
  Object.assign(win, { devicePixelRatio: 3, matchMedia: () => ({ matches: coarse }) });
  Object.assign(doc, { hidden: false });
  Object.assign(canvas, { width: 300, height: 150, clientWidth: 1200, clientHeight: 800, style: {} });
  const constants = new Map();
  const gl = new Proxy({}, {
    get(_, key) {
      if (key === 'drawingBufferWidth') return canvas.width;
      if (key === 'drawingBufferHeight') return canvas.height;
      if (key === 'getExtension') return () => ({});
      if (key === 'getShaderParameter') return () => compile;
      if (key === 'getProgramParameter') return (_program, parameter) => parameter === gl.ACTIVE_UNIFORMS ? 0 : true;
      if (key === 'checkFramebufferStatus') return () => gl.FRAMEBUFFER_COMPLETE;
      if (key.startsWith('create')) return () => { const value = { id: ++id }; resources.add(value); return value; };
      if (key.startsWith('delete')) return (value) => resources.delete(value);
      if (key === 'drawElements') return () => draws++;
      if (key.toUpperCase() === key) {
        if (!constants.has(key)) constants.set(key, constants.size + 1);
        return constants.get(key);
      }
      return () => {};
    },
  });
  canvas.getContext = () => supported ? gl : null;
  for (const [key, value] of Object.entries({
    window: win, document: doc,
    requestAnimationFrame: (callback) => { const frame = ++id; frames.set(frame, callback); return frame; },
    cancelAnimationFrame: (frame) => frames.delete(frame),
  })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => original ? Object.defineProperty(globalThis, key, original) : delete globalThis[key]);
  }
  t.mock.method(performance, 'now', () => now);
  function pointer(type = 'pointermove', properties = {}) {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, { clientX: 300, clientY: 250, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, ...properties });
    win.dispatchEvent(event);
    assert.equal(event.defaultPrevented, false);
  }
  return {
    win, doc, canvas, resources, frames, pointer,
    get draws() { return draws; },
    frame(time) {
      now = time;
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach(callback => callback(time));
    },
  };
}

test('unsupported graphics gracefully leaves the page usable', t => {
  const env = setup(t, { supported: false });
  const stop = startSplash(env.canvas);
  env.pointer();
  assert.equal(env.resources.size, 0);
  assert.equal(env.frames.size, 0);
  stop();
});

test('resizing releases old buffers; cleanup also removes input and animation work', t => {
  const env = setup(t);
  const stop = startSplash(env.canvas);
  const initialResources = env.resources.size;
  assert.ok(initialResources > 0);
  assert.equal(env.canvas.width, 1800, 'device pixel ratio is capped');
  for (let i = 0; i < 8; i++) {
    env.canvas.clientWidth += 30;
    env.win.dispatchEvent(new Event('resize'));
    assert.equal(env.resources.size, initialResources);
  }
  env.pointer();
  assert.equal(env.frames.size, 1);
  env.pointer();
  assert.equal(env.frames.size, 1, 'only one animation loop');
  stop();
  stop();
  assert.equal(env.resources.size, 0);
  assert.equal(env.frames.size, 0);
  const draws = env.draws;
  env.pointer('pointerdown');
  assert.equal(env.draws, draws);
});

test('animation sleeps while idle or hidden and wakes on new input', t => {
  const env = setup(t);
  const stop = startSplash(env.canvas);
  assert.equal(env.frames.size, 0, 'no perpetual loop on page load');
  env.pointer();
  env.frame(3000);
  assert.equal(env.frames.size, 0);
  env.pointer();
  assert.equal(env.frames.size, 1);
  env.doc.hidden = true;
  env.doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(env.frames.size, 0);
  env.pointer();
  assert.equal(env.frames.size, 0);
  env.doc.hidden = false;
  env.pointer();
  assert.equal(env.frames.size, 1);
  stop();
});

test('primary touch animates without cancelling scrolling; cancelled touches stop injecting', t => {
  const env = setup(t, { coarse: true });
  const stop = startSplash(env.canvas);
  env.pointer('pointerdown', { pointerType: 'touch' });
  env.pointer('pointermove', { pointerType: 'touch', clientX: 400 });
  env.frame(16);
  assert.ok(env.draws > 0);
  env.pointer('pointercancel', { pointerType: 'touch' });
  env.frame(3000);
  env.pointer('pointermove', { pointerType: 'touch' });
  assert.equal(env.frames.size, 0);
  stop();
});

test('shader failures release partially initialized GPU resources', t => {
  const env = setup(t, { compile: false });
  assert.throws(() => startSplash(env.canvas), /shader compilation/);
  assert.equal(env.resources.size, 0);
  assert.equal(env.frames.size, 0);
});
