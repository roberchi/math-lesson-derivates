import { describe, expect, it } from 'vitest';
import { equalScaleYRange } from './plot';

describe('equalScaleYRange', () => {
  it('assegna la stessa scala in pixel agli assi x e y', () => {
    const width = 900;
    const height = 600;
    const xMin = -4;
    const xMax = 4;
    const { yMin, yMax } = equalScaleYRange(width, height, xMin, xMax, 2);
    expect(width / (xMax - xMin)).toBeCloseTo(height / (yMax - yMin), 10);
    expect((yMin + yMax) / 2).toBeCloseTo(2, 10);
  });
});
