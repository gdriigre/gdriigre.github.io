import assert from 'node:assert/strict';
import { test } from 'node:test';
import { easeGaze, gazeTarget } from './gaze-math.ts';

const origin = { x: 500, y: 250 };

test('head follows the pointer in all four directions and rests at the origin', () => {
  assert.deepEqual(gazeTarget(origin, origin, 274, 423), { x: 0, y: 0 });
  assert.ok(gazeTarget({ x: 600, y: 250 }, origin, 274, 423).x > 0);
  assert.ok(gazeTarget({ x: 400, y: 250 }, origin, 274, 423).x < 0);
  assert.ok(gazeTarget({ x: 500, y: 150 }, origin, 274, 423).y < 0);
  assert.ok(gazeTarget({ x: 500, y: 350 }, origin, 274, 423).y > 0);
});

test('distant pointers and temporarily zero-sized frames produce finite, bounded gaze', () => {
  for (const [width, height] of [[274, 423], [247, 373], [0, 0]]) {
    for (const pointer of [{ x: -100000, y: 90000 }, { x: 90000, y: -100000 }]) {
      const result = gazeTarget(pointer, origin, width, height);
      assert.ok(Number.isFinite(result.x) && Number.isFinite(result.y));
      assert.ok(Math.hypot(result.x, result.y) <= 1.000001);
      assert.equal(Math.sign(result.x), Math.sign(pointer.x - origin.x));
      assert.equal(Math.sign(result.y), Math.sign(pointer.y - origin.y));
    }
  }
});

test('smoothing converges without overshoot, then returns to the front', () => {
  const target = { x: 0.7, y: -0.5 };
  let current = { x: 0, y: 0 };
  for (let i = 0; i < 90; i++) {
    current = easeGaze(current, target, 16);
    assert.ok(current.x >= 0 && current.x <= target.x);
    assert.ok(current.y <= 0 && current.y >= target.y);
  }
  assert.ok(Math.hypot(current.x - target.x, current.y - target.y) < 0.001);
  for (let i = 0; i < 90; i++) current = easeGaze(current, { x: 0, y: 0 }, 16);
  assert.ok(Math.hypot(current.x, current.y) < 0.001);
});

test('the head keeps responding gradually beyond the portrait instead of hitting a hard limit', () => {
  const positions = [50, 150, 300, 600, 1200].map((distance) =>
    gazeTarget({ x: origin.x + distance, y: origin.y }, origin, 274, 423).x,
  );
  for (let i = 1; i < positions.length; i++) {
    assert.ok(positions[i] > positions[i - 1]);
    assert.ok(positions[i] < 1);
  }
});

test('motion has the same timing at 30, 60 and 120 Hz and cannot jump after a pause', () => {
  const target = { x: 0.8, y: -0.4 };
  const results = [30, 60, 120].map((hz) => {
    let current = { x: 0, y: 0 };
    for (let i = 0; i < hz; i++) current = easeGaze(current, target, 1000 / hz);
    return current;
  });
  for (const current of results) {
    assert.ok(Math.abs(current.x - results[0].x) < 1e-12);
    assert.ok(Math.abs(current.y - results[0].y) < 1e-12);
  }
  assert.deepEqual(easeGaze({ x: 0, y: 0 }, target, 10000), easeGaze({ x: 0, y: 0 }, target, 80));
});

test('eyes acquire the target before the head, and both settle on the same direction', () => {
  const target = { x: 0.8, y: -0.5 };
  let eyes = { x: 0, y: 0 };
  let head = { x: 0, y: 0 };
  for (let i = 0; i < 8; i++) {
    eyes = easeGaze(eyes, target, 16, 65);
    head = easeGaze(head, target, 16);
    assert.ok(eyes.x > head.x && eyes.y < head.y);
    assert.ok(eyes.x <= target.x && eyes.y >= target.y);
  }
  for (let i = 0; i < 90; i++) {
    eyes = easeGaze(eyes, target, 16, 65);
    head = easeGaze(head, target, 16);
  }
  assert.ok(Math.hypot(eyes.x - head.x, eyes.y - head.y) < 0.001);
});
