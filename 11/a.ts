import input from "./input.txt";

type Position = [number, number];

const map = input.split("\n").map((set) => {
  return set.split("");
});
// Find expanding parts (indices) of the universe
const verticallyExpanding = map
  .flatMap((row, y) => (row.some((c) => c === "#") ? undefined : y))
  .filter(Number);

const horizontallyExpanding = map
  .map((_, i) => map.map((row) => row[i])) // rows to columns
  .flatMap((row, y) => (row.some((c) => c === "#") ? undefined : y))
  .filter(Number);

// Find galaxies
const galaxies = map
  .flatMap((row, y) => {
    return row.map((col, x) => {
      if (col === "#") return [x, y];
    });
  })
  .filter(Boolean) as Position[];

// Sum of distances between all galaxies
function solve(expFactor: number) {
  const distances: number[] = [];

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      distances.push(galaxyDistance(galaxies[i], galaxies[j], expFactor));
    }
  }
  return distances.reduce((a, b) => a + b, 0);
}

console.log("🚀 ~ part 1:", solve(2)); // 10228230
console.log("🚀 ~ part 2:", solve(1000000)); // 447073334102

function galaxyDistance(pos1: Position, pos2: Position, expFactor: number) {
  // Calculate the number of expanding universe parts between two galaxies
  let horCrossings = 0;
  let vertCrossings = 0;

  horizontallyExpanding.forEach((x) => {
    if (!x) return;
    const crossingExpansion =
      x >= Math.min(pos1[0], pos2[0]) && x <= Math.max(pos1[0], pos2[0]);
    if (crossingExpansion) horCrossings++;
  });

  verticallyExpanding.forEach((y) => {
    if (!y) return;
    const crossingExpansion =
      y >= Math.min(pos1[1], pos2[1]) && y <= Math.max(pos1[1], pos2[1]);
    if (crossingExpansion) vertCrossings++;
  });

  // Calculate distance
  const dist =
    Math.abs(pos1[0] - pos2[0]) +
    horCrossings * (expFactor - 1) +
    Math.abs(pos1[1] - pos2[1]) +
    vertCrossings * (expFactor - 1);

  return dist;
}

function printMap(map: string[][]) {
  console.log(map.map((c) => c.join("")).join("\n"));
}
