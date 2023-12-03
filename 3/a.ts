import input from "./input.txt";

const lines = input.split("\n");

const validNumbers: number[] = [];
const starMatches: { pos: [number, number]; number: number }[] = [];

lines.forEach((_line, lineNumber) => {
  const line = _line + "."; // add padding to the right
  let tmpNum = "";
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char.match(/\d/)) tmpNum += char;
    else if (
      tmpNum.length &&
      hasAdjacentSymbols(lineNumber, i - tmpNum.length, tmpNum.length, +tmpNum)
    ) {
      validNumbers.push(+tmpNum);
      tmpNum = "";
    } else tmpNum = "";
  }
});

const sum = validNumbers.reduce((a, b) => a + b, 0);
const gearRatios = getStarsWithTwoAdjNumbers();

console.log("🚀 ~ sum:", sum); // 533784
console.log("🚀 ~ gearRatios:", gearRatios); // 78826761

function hasAdjacentSymbols(
  line: number,
  pos: number,
  length: number,
  number: number
) {
  let above = "";
  let below = "";
  let middle = "";

  const maxLeft = Math.max(pos - 1, 0);
  const maxRight = Math.min(pos + length + 1, lines[line].length);

  // Top to bottom
  if (lines[line - 1]) above = lines[line - 1].slice(maxLeft, maxRight);
  middle = lines[line].slice(maxLeft, maxRight);
  if (lines[line + 1]) below += lines[line + 1].slice(maxLeft, maxRight);

  const symbols = (above + below + middle)
    .replaceAll(".", "")
    .replaceAll(/\d/g, "");

  // Save position of stars with adjacent number
  above.split("").forEach((char, i) => {
    if (char === "*")
      starMatches.push({ pos: [maxLeft + i, line - 1], number });
  });
  middle.split("").forEach((char, i) => {
    if (char === "*") starMatches.push({ pos: [maxLeft + i, line], number });
  });
  below.split("").forEach((char, i) => {
    if (char === "*")
      starMatches.push({ pos: [maxLeft + i, line + 1], number });
  });

  return symbols.length > 0;
}

function getStarsWithTwoAdjNumbers() {
  const positions = new Map<string, number[]>();

  starMatches.forEach(({ pos, number }) => {
    const key = pos.join(",");
    const curr = positions.get(key);
    if (curr) positions.set(key, [...curr, number]);
    else positions.set(key, [number]);
  });

  let sumGearRatios = 0;

  positions.forEach((numbers, key) => {
    if (numbers.length === 2) sumGearRatios += numbers[0] * numbers[1];
  });
  return sumGearRatios;
}
