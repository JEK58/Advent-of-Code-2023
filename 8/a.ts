import input from "./input.txt";

const raw = input.split("\n\n");
const instructions = raw
  .shift()
  ?.replaceAll("R", "2")
  .replaceAll("L", "1")
  .split("");

const map = raw[0].split("\n").map((row) =>
  row
    .replace(/[^A-Z\s]/gi, "")
    .replaceAll("  ", " ")
    .split(" ")
);

let position = "AAA";
let step = 0;

while (position !== "ZZZ") {
  //   console.log("Current position", position);

  const instruction = instructions?.at(step % instructions.length);
  if (!instruction) throw new Error("No instruction");
  const newPosition = map
    ?.at(map.findIndex((row) => row.at(0) === position))
    ?.at(+instruction);
  if (!newPosition) throw new Error("No new position found");
  position = newPosition;
  step++;
}

console.log("🚀 ~ step:", step);
