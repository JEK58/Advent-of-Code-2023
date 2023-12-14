import input from "./input.txt";

const sequences = input.split("\n");

function tilt(input: string[]) {
  const newMap: string[] = [];

  input.forEach((seq) => {
    const indices = seq
      .split("")
      .map((item, i) => (item === "#" ? i : null))
      .filter((el) => el !== null) as number[];

    indices.unshift(-1);

    const rolling = seq.split("#").map((item) => item.replaceAll(".", ""));

    const end = new Array(seq.length).fill(".");

    indices.forEach((index) => (end[index] = "#"));
    rolling.forEach((item, i) => {
      const index = indices[i] + 1;
      item.split("").forEach((el, j) => {
        end[index + j] = el;
      });
    });

    newMap.push(end.join(""));
    const sum = indices.map((index, i) => {
      const maxPoints = seq.length;
      const points = maxPoints - index - 1;
      const amount = rolling[i].length;

      const sum = (amount / 2) * (points + (points - amount + 1));
      return sum;
    });
    return sum;
  });
  return rearrangeStrings(newMap);
}

function cycle(input: string[], once: boolean = false) {
  const n = tilt(rearrangeStrings([...input]));
  if (once) return n;
  const w = tilt(rearrangeStrings(turnMapLeft(n)));
  const s = tilt(rearrangeStrings(turnMapLeft(w)));
  const e = tilt(rearrangeStrings(turnMapLeft(s)));
  return turnMapLeft(e);
}

function solve(input: string[], cycles: number, cycleOnce: boolean = false) {
  const cache = new Map<string, number>();
  let cycleFound = false;
  let map = input;

  for (let i = 1; i <= cycles; i++) {
    const key = map.join("");
    const cached = cache.get(key);
    if (cached && !cycleFound) {
      cycleFound = true;
      const repeatsAfter = i - cached;

      const foo = Math.floor(cycles / repeatsAfter);

      const c = foo * repeatsAfter;

      i += c - 2 * repeatsAfter;
    } else {
      cache.set(key, i);
    }
    map = cycle(map, cycleOnce);
  }

  const maxPoints = map.length;
  return map
    .map((seq, i) => {
      return (
        seq.split("").filter((item) => item === "O").length * (maxPoints - i)
      );
    })
    .reduce((acc, seq) => acc + seq, 0);
}

const part1 = solve(sequences, 1, true);
const part2 = solve(sequences, 1000000000);

console.log("🚀 ~ Part 1:", part1); // 107053
console.log("🚀 ~ Part 2:", part2); // 88371

function rearrangeStrings(arr: string[]): string[] {
  const maxLength = Math.max(...arr.map((item) => item.length));
  const result: string[] = [];

  for (let i = 0; i < maxLength; i++) {
    let newString = "";
    for (let j = 0; j < arr.length; j++) {
      if (i < arr[j].length) {
        newString += arr[j][i];
      }
    }
    result.push(newString);
  }

  return result;
}

function turnMapLeft(arr: string[]): string[] {
  const maxLength = Math.max(...arr.map((item) => item.length));
  const result: string[] = [];

  for (let i = 0; i < maxLength; i++) {
    let newString = "";
    for (let j = 0; j < arr.length; j++) {
      if (i < arr[j].length) {
        newString += arr[j][i];
      }
    }
    result.push(newString.split("").reverse().join(""));
  }

  return result;
}
