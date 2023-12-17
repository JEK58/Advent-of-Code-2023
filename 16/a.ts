import { readFileSync } from "fs"; // buns readfile doesn't like \\
const input = readFileSync("input.txt", "utf-8");

const map = input.split("\n").map((row) => row.split(""));

type Position = [number, number];
type Direction = "<" | ">" | "v" | "^";

const directions = new Map([
  [">", [1, 0]],
  ["<", [-1, 0]],
  ["v", [0, 1]],
  ["^", [0, -1]],
]);

const derivations = new Map([
  [">:|", ["^", "v"]],
  ["<:|", ["^", "v"]],
  ["<:-", ["<"]],
  [">:-", [">"]],
  ["v:-", ["<", ">"]],
  ["^:-", ["<", ">"]],
  ["^:|", ["^"]],
  ["v:|", ["v"]],
  ["v:/", ["<"]],
  ["^:/", [">"]],
  [">:/", ["^"]],
  ["<:/", ["v"]],
  ["v:\\", [">"]],
  ["^:\\", ["<"]],
  [">:\\", ["v"]],
  ["<:\\", ["^"]],
  ["v:.", ["v"]],
  ["^:.", ["^"]],
  [">:.", [">"]],
  ["<:.", ["<"]],
]);

function solve(start: [Direction, Position][]) {
  return start
    .map((pos) => {
      let hash = new Set<string>();
      let energized = new Set<string>();
      const queue: [Direction, Position][] = [pos];

      while (queue.length > 0) {
        const next = queue.shift();
        if (!next || hash.has(next.toString())) continue;
        hash.add(next.toString());
        energized.add(next[1].toString());
        const options = nextPositions(next);
        if (!options) continue;
        queue.push(...options);
      }
      return energized.size;
    })
    .reduce((acc, curr) => Math.max(acc, curr), 0);
}

const startPositions: [Direction, Position][] = [];

for (let i = 0; i < map[1].length; i++) {
  startPositions.push(["v", [i, 0]]);
  startPositions.push(["^", [i, map.length - 1]]);
}

for (let i = 0; i < map.length; i++) {
  startPositions.push([">", [0, i]]);
  startPositions.push(["<", [map[1].length - 1, i]]);
}

console.log("🚀 ~ part 1:", solve([[">", [0, 0]]])); // 6514
// Could be further optimized by reusing hashes between start positions
console.log("🚀 ~ part 2:", solve(startPositions)); // 8089

function nextPositions(state: [Direction, Position]) {
  const [dir, [currX, currY]] = state;
  const currDerivation = map[currY][currX];
  const options = derivations.get(`${dir}:${currDerivation}`);

  const nextPositions = options
    ?.map((option) => {
      const directionVector = directions.get(option);
      if (!directionVector) throw new Error("Invalid new direction");

      const [nextX, nextY] = [
        currX + directionVector[0],
        currY + directionVector[1],
      ];

      if (
        nextX < 0 ||
        nextY < 0 ||
        nextX >= map[1].length ||
        nextY >= map.length
      )
        return;
      return [option, [nextX, nextY]];
    })
    .filter(Boolean) as [Direction, Position][];
  return nextPositions;
}
