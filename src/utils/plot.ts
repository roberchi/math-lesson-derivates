export function equalScaleYRange(width: number, height: number, xMin: number, xMax: number, yCenter: number) {
  const xUnitsPerPixel = (xMax - xMin) / width;
  const ySpan = xUnitsPerPixel * height;
  return { yMin: yCenter - ySpan / 2, yMax: yCenter + ySpan / 2 };
}
