export function getTrendGeometry(values, pointCount, yForValue) {
  const denominator = Math.max(1, pointCount - 1);
  const points = [];
  values.forEach((value, index) => {
    if (!Number.isFinite(value)) return;
    points.push({
      index,
      x: 40 + (index / denominator) * 420,
      y: yForValue(value),
    });
  });

  return {
    points,
    path: points.map((point, index) =>
      `${index === 0 ? "M" : "L"}${point.x},${point.y}`,
    ).join(" "),
  };
}
