import input from "./input.txt";

let start: [number, number] = [0, 0];
const map = input.split("\n").map((line, r) =>
  line.split("").map((char, c) => {
    if (char === "S") start = [r, c];
    return char;
  })
);
// prettier-ignore
const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

function solve(steps: number) {
  let visited = new Set<string>([start.join(",")]);

  for (let i = 0; i < steps; i++) {
    const maxR = map.length;
    const maxC = map[0].length;

    const positions = [...visited].map((pos) => pos.split(",").map(Number));
    visited.clear();

    positions.forEach(([r, c]) => {
      directions.forEach(([dr, dc]) => {
        const [nr, nc] = [r + dr, c + dc];
        const modR = nr % maxR;
        const modC = nc % maxC;
        const R = modR < 0 ? maxR - Math.abs(modR) : modR;
        const C = modC < 0 ? maxC - Math.abs(modC) : modC;

        if (map[R]?.[C] === "#") return;
        visited.add([nr, nc].join(","));
      });
    });
  }
  return visited.size;
}

// Part 2
const steps = 26501365;
const remainder = steps % map.length;

const a = solve(remainder);
const b = solve(remainder + map.length);
const c = solve(remainder + map.length * 2);

// Quadratic equation from three points (y = an^2 + bn + c)
// https://www.radfordmathematics.com/algebra/sequences-series/difference-method-sequences/quadratic-sequences.html
const A = (a - 2 * b + c) / 2;
const B = (-3 * a + 4 * b - c) / 2;
const C = a;

const n = Math.floor(steps / map.length);
// TODO: Speed this up
const part2 = A * n ** 2 + B * n + C;

console.log("🚀 ~ part 1:", solve(64)); // 3731
console.log("🚀 ~ part 2:", part2); // 617565692567199
