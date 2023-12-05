import input from "./input.txt";

const [_seeds, soil, fertilizer, water, light, temperature, humidity, loc] =
  input.split("\n\n").map((set) =>
    set
      .split("\n")
      .map((map) => map.match(/\d+/g)?.map(Number))
      .filter(Boolean)
  );

const seeds = _seeds.flat() as number[];

const seedsFromRange = seeds.reduce<number[][]>((prev, _, index, array) => {
  if (index % 2 === 0) prev.push(array.slice(index, index + 2));
  return prev;
}, []);
// console.log("🚀 ~ seedsFromRange:", seedsFromRange);

// console.log("Closest Part 1", solver(seeds));
// console.log("Closest Part 2", solver(seedsFromRange));

let closest = Number.MAX_SAFE_INTEGER;
seedsFromRange.forEach(([start, length]) => {
  // if (!seed) return;
  console.log("New seed", start, length);

  for (let i = start; i < start + length; i++) {
    let location = i;
    [soil, fertilizer, water, light, temperature, humidity, loc].forEach(
      (el) => {
        let tmp: number | undefined;
        let k = 0;
        while (!tmp) {
          const bar = el[k++];
          if (!bar) return;
          tmp = rangeSolver(bar, location);
        }
        location = tmp ?? location;
      }
    );
    closest = Math.min(closest, location);
  }
});
console.log("🚀 ~ closest:", closest); // 2520479

function rangeSolver([dest, src, length]: number[], id: number) {
  const srcRange = src + length - 1;
  const destRange = dest + length - 1;

  if (id >= src && id <= srcRange) {
    const loc = dest + (id - src);
    if (loc >= dest && loc <= destRange) return loc;
  }
}
