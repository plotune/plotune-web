import { getTrendGeometry } from "./trendModel";

test("connects observed values across empty time buckets and marks every observed point", () => {
  const geometry = getTrendGeometry([null, 22.1, null, null, 22.4], 5, (value) => 100 - value);

  expect(geometry.path).toBe("M145,77.9 L460,77.6");
  expect(geometry.points).toEqual([
    { index: 1, x: 145, y: 77.9 },
    { index: 4, x: 460, y: 77.6 },
  ]);
});

test("keeps a single observation as a point without inventing a line", () => {
  const geometry = getTrendGeometry([null, 9, null], 3, (value) => value);

  expect(geometry.path).toBe("M250,9");
  expect(geometry.points).toHaveLength(1);
});
