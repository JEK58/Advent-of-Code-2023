import input from "./input.txt";

const table = input
  .split("\n")
  .map((map) => map.match(/\d+/g)?.map(Number)) as number[][];

const races: number[][] = table[0].map((_, index) => [
  table[0][index],
  table[1][index],
]);

const race = input
  .split("\n")
  .map((map) => map.replaceAll(" ", "").match(/\d+/g)?.map(Number))
  .flat() as [number, number];

const part1 = races
  .map(([time, dist]) => solver([time, dist]))
  .reduce((prev, curr) => prev * curr, 1);

const part2 = solver(race);

function solver([time, dist]: [number, number]) {
  // https://en.wikipedia.org/wiki/Quadratic_formula
  const x1 = (-time + Math.sqrt(time ** 2 - 4 * -1 * -dist)) / (2 * -1);
  const x2 = (-time - Math.sqrt(time ** 2 - 4 * -1 * -dist)) / (2 * -1);
  const x = Math.abs(Math.floor(x1) - Math.ceil(x2) + 1);

  return x;
}

console.log("🚀 ~ Part 1:", part1); // 503424
console.log("🚀 ~ Part 2:", part2); // 32607562
console.log("🚀 ~ Runtime:", Bun.nanoseconds() / 1000000, "ms");
