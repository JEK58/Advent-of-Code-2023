import input from "./input.txt";

const seq = input.split(",");

const part1 = seq.map((s) => hash(s)).reduce((acc, curr) => acc + curr, 0);

// part 2
let hashmap: Map<string, number>[] = [];

seq.forEach((s) => {
  const operation = s.includes("-") ? "-" : "=";
  const [label, fLength] = s.split(operation);
  const labelHash = hash(label);

  switch (operation) {
    case "-":
      if (hashmap[labelHash] && hashmap[labelHash].has(label))
        hashmap[labelHash].delete(label);
      break;
    case "=":
      if (!hashmap[labelHash]) {
        const item = new Map();
        item.set(label, parseInt(fLength));
        hashmap[labelHash] = item;
      } else {
        hashmap[labelHash].set(label, parseInt(fLength));
      }
      break;
  }
});

const part2 = hashmap
  .map((box, i) => {
    if (!(box.size >= 1)) return 0;

    const power = i + 1;
    const sum = [...box.entries()].map((el, j) => el[1] * (j + 1) * power);
    return sum.reduce((acc, curr) => acc + curr, 0);
  })
  .filter(Boolean)
  .reduce((acc, curr) => acc + curr, 0);

function hash(input: string) {
  let currVal = 0;
  input.split("").forEach((element) => {
    currVal += element.charCodeAt(0);
    currVal *= 17;
    currVal %= 256;
  });
  return currVal;
}

console.log("🚀 ~ part1:", part1); // 513158
console.log("🚀 ~ part2:", part2); // 200277
