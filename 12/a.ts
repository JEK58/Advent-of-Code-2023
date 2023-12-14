import input from "./input.txt";

const records = input.split("\n").map((set) => set.split(" "));
const extendedRecors = records.map((record) => {});

// console.log("🚀 ~ records:", records);

function isValid(conditions: string, check: string) {
  if (conditions.includes("?")) return false;
  const foo = conditions
    .split(".")
    .map((set) => set.length)
    .filter((set) => set > 0)
    .join(",");

  return foo == check;
}

function bar(record: string[]) {
  let arrangements = 0;
  const options = ["#", "."];
  const [input, check] = record;
  if (!input.includes("?")) return arrangements;
  // console.log("🚀 ~ input:", input);

  options.map((opt) => {
    const str = input.replace("?", opt);
    if (isValid(str, check)) arrangements++;
    else arrangements += bar([str, check]);
  });
  return arrangements;
}

const sum = records.reduce((acc, record) => {
  return acc + bar(record);
}, 0);
console.log("🚀 ~ sum:", sum);
