import input from "./input.txt";

const hands = input.split("\n").map((line) => line.split(" "));
// prettier-ignore
const strength = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]
const replaceChar = ["U", "0", "W", "X", "Y"].reverse();

const handsWithRank = hands.map((hand) => {
  const rank = getHandRanking(hand);
  const replaced = hand[0]
    .split("")
    .map((char) => {
      const index = strength.indexOf(char);
      return index > -1 && index < 5 ? replaceChar[index] : char;
    })
    .join("");

  return [`${rank}:${replaced}`, hand[1], hand[0]];
});

const sorted = handsWithRank.sort((a, b) => ("" + a[0]).localeCompare(b[0]));

const part2 = sorted.reduce((prev, curr, i) => {
  return prev + +curr[1] * (i + 1);
}, 0);

function getHandRanking(hand: string[]) {
  const sorted = hand[0].split("").toSorted();

  const countOccurrences: { [key: string]: number } = sorted.reduce(
    (acc: { [key: string]: number }, val: string) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    },
    {}
  );

  // Converting the object into a sorted array of arrays [[item, count], ...]
  const sort: [string, number][] = Object.entries(countOccurrences).sort(
    (a, b) => b[1] - a[1]
  );

  const index = sort.findIndex((el) => el[0] === "J");

  if (index > -1) {
    const jokers = sort.splice(index, 1);
    if (sort.length === 0) return 6; // five jokers
    sort[0][1] = sort[0][1] + jokers[0][1];
  }

  if (sort.length === 1) return 6; // five of a kind

  const f = +sort[0][1];
  const s = +sort[1][1];

  if (sort.length === 5) return 0; // high card
  if (f === 2 && s === 2) return 2; // two pair
  if (f === 3 && s === 2) return 4; // full house
  if (f === 2) return 1; // pair
  if (f === 3) return 3; // three of a kind
  if (f === 4) return 5; // four of a kind
}

console.log("🚀 ~ part1:", part2); // 248750248
