import input from "./input.txt";

const lines = input.split("\n").map((line) => line.split(":")[1]);

const pile = new Map(lines.map((_, i) => [i + 1, 1])); // pre-populate pile
const sum = lines
  .map((line, i) => {
    const [winning, pool] = line
      .split("|")
      .map((set) => set.match(/\d+/g)?.map(Number));
    const common = winning?.filter((num) => pool?.includes(num)).length;
    if (common) {
      const copies = pile.get(i + 1) || 1;
      // For each winning num one sequential card is added to the pile
      for (let j = 2; j <= Math.min(common + 1, lines.length + 1); j++) {
        const curr = pile.get(i + j);
        if (curr) pile.set(i + j, curr + 1 * copies);
      }

      return 2 ** (common - 1); // 2^(n-1)
    } else return 0;
  })
  .reduce((a, b) => a + b, 0);

const cards = [...pile.values()].reduce((a, b) => a + b, 0);

console.log("🚀 ~ sum:", sum); // 23441
console.log("🚀 ~ cards:", cards); // 5923918
