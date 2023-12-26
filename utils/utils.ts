export const row2col = <T>(matrix: T[][]) =>
  matrix[0].map((_, index) => matrix.map((row) => row[index]));

export const gcd = (a: number, b: number): number =>
  b == 0 ? a : gcd(b, a % b);

export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

type Range = [number, number];
export const doRangesIntersect = (range1: Range, range2: Range) => {
  return range1[0] <= range2[1] && range1[1] >= range2[0];
};

// http://paulbourke.net/geometry/pointlineplane/
type Line = [number, number, number, number];
export function findLineIntersection(
  line1: Line,
  line2: Line,
  segmentsOnly = false
) {
  const [x1, y1, x2, y2] = line1;
  const [x3, y3, x4, y4] = line2;

  // Filter line with length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) return false;

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Filter parallel lines
  if (denominator === 0) return false;

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // Optionally only find intersections inside the line segments
  if (segmentsOnly && (ua < 0 || ua > 1 || ub < 0 || ub > 1)) return false;

  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);

  return { x, y };
}
