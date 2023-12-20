import input from "./input.txt";

let [wf, p] = input.split("\n\n");
type Part = { x: number; m: number; a: number; s: number };

const workflows = new Map<string, string[]>();

wf.split("\n").forEach((wf) => {
  const el = wf.replace("}", "").split("{");
  const instruction = el[1].split(",");
  workflows.set(el[0], instruction);
});

const parts = p.split("\n").map((part) =>
  part
    .replace("{", "")
    .replace("}", "")
    .split(",")
    .reduce(
      (acc, item) => {
        const [key, value] = item.split("=");
        // @ts-ignore
        if (key in acc) acc[key] = Number(value);
        return acc;
      },
      { x: 0, m: 0, a: 0, s: 0 }
    )
);

function followWorkflow(key: string, part: Part) {
  const instructions = workflows.get(key);
  if (!instructions) throw new Error("No workflow found");

  for (const instruction of instructions) {
    if (!instruction.includes(":")) return instruction;
    const inst = parseInstruction(instruction);

    if (inst.op === "<" && part[inst.key] < inst.value) return inst.target;
    if (inst.op === ">" && part[inst.key] > inst.value) return inst.target;
  }
  return "R";
}

function parseInstruction(instruction: string) {
  const key = instruction[0] as keyof Part;
  const op = instruction[1];
  const value = instruction.match(/\d+/g)?.map(Number)[0] as number;
  const target = instruction.split(":")[1];

  return { key, op, value, target };
}

const accepted: Part[] = [];
for (const part of parts) {
  let key = "in";
  while (true) {
    key = followWorkflow(key, part);
    if (key === "R") break;
    if (key === "A") {
      accepted.push(part);
      break;
    }
  }
}

const part1 = accepted.reduce((acc, { x, m, a, s }) => acc + x + m + a + s, 0);

// Part 2
// TODO: Fully understand the ranges theory that somehow works...
type Range = [number, number];
type Ranges = { x: Range; m: Range; a: Range; s: Range };

function evaluateCombinations(key: string, input: Ranges): number {
  if (key === "R") return 0;
  if (key === "A") return rangesSize(input);

  const instructions = workflows.get(key);
  if (!instructions) throw new Error("No workflow found");

  let total = 0;
  for (const instruction of instructions) {
    // Fallback instruction
    if (!instruction.includes(":"))
      return (total += evaluateCombinations(instruction, input));

    const inst = parseInstruction(instruction);
    const [lo, hi] = input[inst.key];

    let newRangeA = [0, 0];
    let newRangeB = [0, 0];

    if (inst.op === "<") {
      newRangeA = [lo, inst.value - 1];
      newRangeB = [inst.value, hi];
    }

    if (inst.op === ">") {
      newRangeA = [inst.value + 1, hi];
      newRangeB = [lo, inst.value];
    }
    //
    if (newRangeA[0] <= newRangeA[1])
      total += evaluateCombinations(inst.target, {
        ...input,
        [inst.key]: newRangeA,
      });
    //
    if (newRangeB[0] <= newRangeB[1])
      input = { ...input, [inst.key]: newRangeB };
    else break;
  }
  return total;
}

function rangesSize(ranges: Ranges) {
  const rangeSize = (r: Range) => r[1] - r[0] + 1;
  return (
    rangeSize(ranges.x) *
    rangeSize(ranges.m) *
    rangeSize(ranges.a) *
    rangeSize(ranges.s)
  );
}

const part2 = evaluateCombinations("in", {
  x: [1, 4000],
  m: [1, 4000],
  a: [1, 4000],
  s: [1, 4000],
});

console.log("🚀 ~ part 1:", part1); // 472630
console.log("🚀 ~ part 2:", part2); // 116738260946855
