import input from "./input.txt";

const lines = input.split("\n");
const colors = ["red", "green", "blue"] as const;
const maxPerColor = { red: 12, green: 13, blue: 14 };
let power = 0;
let sum = 0;

lines.forEach((line, i) => {
  const maxColors = { red: 0, green: 0, blue: 0 };
  const sets = line.split(":")[1].split(";");
  const subsets = sets.map((set) => set.split(","));

  subsets.forEach((subset) => {
    subset.forEach((cube) => {
      const { color, amount } = detectColorAndAmount(cube);
      maxColors[color] = Math.max(amount, maxColors[color]);
    });
  });

  if (
    maxColors.red <= maxPerColor.red &&
    maxColors.green <= maxPerColor.green &&
    maxColors.blue <= maxPerColor.blue
  ) {
    sum += +i + 1;
  }

  power += maxColors.red * maxColors.green * maxColors.blue;
});

console.log(sum); //2207
console.log(power); //62241

function detectColorAndAmount(str: string) {
  let color: (typeof colors)[number] = "red";
  let amount = 0;
  colors.forEach((_color) => {
    if (str.includes(_color)) {
      amount = +str.replace(/\D/g, "");
      color = _color;
    }
  });
  return { amount, color };
}
