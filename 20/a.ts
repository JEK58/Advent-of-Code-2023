import input from "./input.txt";

type LogicItem = [string, "bc" | "&" | "%", string[]];

// Input parsing
const config = input.split("\n").map((line) => {
  const [device, destination] = line.split("->");
  const dest = destination.split(",").map((d) => d.trim());

  if (device.trim() === "broadcaster") return ["broadcaster", "bc", dest];
  return [device.slice(1).trim(), device[0], dest];
}) as LogicItem[];

// Create initial logic state
type Broadcaster = { type: "bc"; dest: string[] };
type FlipFlop = { type: "%"; state: boolean; dest: string[] };
type Conjunction = {
  type: "&";
  state: Record<string, boolean>;
  dest: string[];
};
const state = new Map<string, FlipFlop | Conjunction | Broadcaster>();
config.forEach(([id, type, dest]) => {
  if (type === "%") state.set(id, { type, state: false, dest });
  if (type === "&") state.set(id, { type, state: {}, dest });
  if (type === "bc") state.set(id, { type, dest });
});

// Find conjunction inputs and set them to false
config.forEach(([id, type]) => {
  if (type !== "&") return;
  const inputs = config.filter((el) => el[2].includes(id)).map((el) => el[0]);
  const item = state.get(id);
  if (item?.type != "&") throw new Error("Wrong device type");
  inputs.forEach((input) => (item.state[input] = false));
});

const heap: [string, boolean, string][] = [];

const flipFlop = (id: string, input: boolean) => {
  if (input) return; // Do nothing on high input
  const item = state.get(id);
  if (item?.type !== "%") throw new Error("Wrong device type");
  item.state = !item.state; // Flip on low input
  item.dest.forEach((d) => heap.push([d, item.state, id]));
};

const broadcaster = (id: string, input: boolean) => {
  if (input) return; // Do nothing on high input
  const item = state.get(id);
  if (item?.type !== "bc") throw new Error("Wrong device type");
  item.dest.forEach((d) => heap.push([d, input, id]));
};

const conjunction = (id: string, input: boolean, origin: string) => {
  const item = state.get(id);
  if (item?.type !== "&") throw new Error("Wrong device type");
  item.state[origin] = input;

  if (Object.values(item.state).every((value) => value === true))
    item.dest.forEach((d) => heap.push([d, false, id]));
  else item.dest.forEach((d) => heap.push([d, true, id]));
};

let hi = 0;
let lo = 0;

// In my case nd, pc, vd, and tx need to be hi to send a low to rx
// prettier-ignore
let nd = 0, pc = 0, vd = 0, tx = 0;

let buttonPresses = 1;
while (nd * pc * vd * tx === 0) {
  heap.push(["broadcaster", false, "button"]);
  while (heap.length) {
    const operation = heap.shift();
    if (!operation) throw new Error("No operation found");
    const [dest, pulse, origin] = operation;
    if (dest === "output") continue;

    if (buttonPresses < 1001) pulse ? hi++ : lo++; // part 1
    const item = state.get(dest);
    if (!item) continue;

    // Detect cycles of conjunctions connected to the final one
    if (origin === "nd" && pulse) nd = buttonPresses;
    if (origin === "pc" && pulse) pc = buttonPresses;
    if (origin === "vd" && pulse) vd = buttonPresses;
    if (origin === "tx" && pulse) tx = buttonPresses;

    // Process operation
    if (item.type === "bc") broadcaster(dest, pulse);
    if (item.type === "&") conjunction(dest, pulse, origin);
    if (item.type === "%") flipFlop(dest, pulse);
  }
  buttonPresses++;
}

const part1 = hi * lo;
const part2 = nd * pc * vd * tx; // It worked but it could have not been the LCM straight away

console.log("🚀 ~ part 1:", part1); // 807069600
console.log("🚀 ~ part 2:", part2); // 221453937522197
