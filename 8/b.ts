import input from "./input.txt";

const raw = input.split("\n\n");
const instructions = raw
  .shift()
  ?.replaceAll("R", "2")
  .replaceAll("L", "1")
  .split("");

const map = raw[0].split("\n").map((row) =>
  row
    .replace(/[^A-Z1-9\s]/gi, "")
    .replaceAll("  ", " ")
    .split(" ")
);

const startNodes = map.filter((row) => row[0][2] === "A");

const cycles = startNodes.map((node) => {
  let position = node.at(0);
  if (!position) throw new Error("No position");
  let step = 0;

  while (position[2] !== "Z") {
    const instruction = instructions?.at(step % instructions.length);
    if (!instruction) throw new Error("No instruction");
    const newPosition = map
      ?.at(map.findIndex((row) => row.at(0) === position))
      ?.at(+instruction);
    if (!newPosition) throw new Error("No new position found");
    position = newPosition;
    step++;
  }
  return step;
});

const gcdOfCycles = cycles.reduce((a, b) => gcd(a, b));
const steps = cycles.reduce((a, b) => (a * b) / gcdOfCycles, 1) * gcdOfCycles;

function gcd(a: number, b: number) {
  if (b == 0) return a;
  else return gcd(b, a % b);
}

console.log("🚀 ~ part2:", steps); // 18024643846273
