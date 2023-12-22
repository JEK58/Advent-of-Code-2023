export const row2col = <T>(matrix: T[][]) =>
  matrix[0].map((_, index) => matrix.map((row) => row[index]));

export const gcd = (a: number, b: number): number =>
  b == 0 ? a : gcd(b, a % b);

export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

type Range = [number, number];
export const doRangesIntersect = (range1: Range, range2: Range) => {
  return range1[0] <= range2[1] && range1[1] >= range2[0];
};
