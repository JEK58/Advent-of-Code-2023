import input from "./input.txt";

const sequences = input.split("\n").map((n) => n.split(" ").map((n) => +n));

const histories = sequences.map((seq) => {
  const tree: number[][] = [seq];

  while (!tree.at(-1)?.every((n) => n === 0)) {
    const last = tree.at(-1);
    if (!last) throw new Error("last is undefined");

    let tmp: number[] = [];
    for (let i = 0; i < last.length - 1; i++) {
      tmp.push(last[i + 1] - last[i]);
    }
    tree.push(tmp);
  }
  return {
    beginning: tree.reduceRight((acc, cur) => cur.at(0)! - acc, 0),
    prediction: tree.reduceRight((acc, cur) => acc + cur.at(-1)!, 0),
  };
});

const part1 = histories.reduce((acc, cur) => acc + cur.prediction, 0);
const part2 = histories.reduce((acc, cur) => acc + cur.beginning, 0);

console.log("🚀 ~ part1:", part1); // 1819125966
console.log("🚀 ~ part2:", part2); // 1140
