export const row2col = <T>(matrix: T[][]) =>
  matrix[0].map((_, index) => matrix.map((row) => row[index]));
