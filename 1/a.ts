import input from "./input.txt";

const lines = sanitize(input).split("\n");

const sum = lines
  .map((line) => {
    const digits = line.replace(/\D/g, "");
    return digits[0] + digits[digits.length - 1];
  })
  .reduce((a, b) => a + +b, 0);

console.log("🚀 ~ sum:", sum);

function sanitize(str: string): string {
  return str
    .replace(/one/g, "o1e")
    .replace(/two/g, "t2o")
    .replace(/three/g, "th3ee")
    .replace(/four/g, "fo4ur")
    .replace(/five/g, "fi5ve")
    .replace(/six/g, "s6x")
    .replace(/seven/g, "se7en")
    .replace(/eight/g, "ei8th")
    .replace(/nine/g, "ni9ne");
}
