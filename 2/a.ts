import input from "./input.txt";

const lines = input.split("\n");
const colors = ["red", "green", "blue"] as const;
const maxPerColor = { red: 12, green: 13, blue: 14 };
let power = 0;
let sum = 0;

lines.forEach((line, i) => {
  const sets = line.split(":")[1].split(";");
  const maxColors = { red: 0, green: 0, blue: 0 };
  const subsets = sets.map((set) => set.split(","));

  subsets.forEach((subset) => {
    subset.forEach((cube) => {
      const { color, amount } = detectColorAndAmount(cube);
      if (amount > maxColors[color]) maxColors[color] = amount;
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

console.log(sum);
console.log(power);

function detectColorAndAmount(str: string) {
  let color: "red" | "green" | "blue" = "red";
  let amount = 0;
  colors.forEach((_color) => {
    if (str.includes(_color)) {
      amount = +str.replace(/\D/g, "");
      color = _color;
    }
  });
  return { amount, color };
}
