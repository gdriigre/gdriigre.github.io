export type GazePoint = { x: number; y: number };

export function gazeTarget(
  pointer: GazePoint,
  origin: GazePoint,
  width: number,
  height: number,
): GazePoint {
  const x = (pointer.x - origin.x) / Math.max(width * 1.05, 1);
  const y = (pointer.y - origin.y) / Math.max(height * 0.8, 1);
  // Approach the movement limit gradually, without a hard stop near the face.
  const distance = Math.sqrt(1 + x * x + y * y);
  return { x: x / distance, y: y / distance };
}

export function easeGaze(current: GazePoint, target: GazePoint, elapsedMs: number, responseMs = 160): GazePoint {
  const amount = 1 - Math.exp(-Math.min(Math.max(elapsedMs, 0), 80) / Math.max(responseMs, 1));
  return {
    x: current.x + (target.x - current.x) * amount,
    y: current.y + (target.y - current.y) * amount,
  };
}
