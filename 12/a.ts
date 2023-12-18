import input from "./input.txt";
const records = input.split("\n");

const cache = new Map<string, number>();

function count(springs: string, check: number[]) {
  // If both the springs and checks are empty it must be a valid solution => 1
  // If there are no more springs in the configuration but still checks left, it can't be a valid solution => 0
  if (springs === "") return check.length === 0 ? 1 : 0;

  // If the checks are empty and there are no more springs left, it must be a valid solution => 1
  // If the checks are empty but there is still a spring(#) in the configuration it cant be a valid solution => 0
  if (check.length === 0) return springs.includes("#") ? 0 : 1;

  const key = springs + check.join(",");
  const cached = cache.get(key);

  if (cached !== undefined) return cached;

  let result = 0;

  // If the first item in the config is a "." or "?" call the function recursively with the first item removed
  // This is the same as replacing the "?" with a ".".
  if (springs[0] === "." || springs[0] === "?")
    result += count(springs.slice(1), check);

  if (springs[0] === "#" || springs[0] === "?") {
    if (
      // There must be at least as many springs left as the check would require
      check[0] <= springs.length &&
      // The consecutive spring items cannot contain a "." in the range of the check sum
      !springs.slice(0, check[0]).includes(".") &&
      // The check sum must be equal to the number of springs
      // Or the spring item at the position of the check is not a "#"
      (check[0] === springs.length || springs[check[0]] !== "#")
    ) {
      result += count(springs.slice(check[0] + 1), check.slice(1));
    }
  }

  cache.set(key, result);
  return result;
}

// part 1
const part1 = records
  .map((record) => {
    let [springs, check] = record.split(" ");
    let checks = check.split(",").map(Number);
    return count(springs, checks);
  })
  .reduce((a, b) => a + b, 0);

// part 2
const part2 = records
  .map((record) => {
    let [springs, check] = record.split(" ");
    let checks = check.split(",").map(Number);

    // Repeat the checks and springs 5 times
    checks = checks.concat(checks, checks, checks, checks);
    springs = Array(5).fill(springs).join("?");

    return count(springs, checks);
  })
  .reduce((a, b) => a + b, 0);

console.log("🚀 ~ part1:", part1);
console.log("🚀 ~ part2:", part2);
