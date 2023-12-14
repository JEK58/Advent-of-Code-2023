import input from "./input.txt";

const patterns = input.split("\n\n").map((set) => set.split("\n"));

// Transform patterns row => col to use the same function in both directions
function transformPatterns(arr: string[]): string[] {
  const maxLength = Math.max(...arr.map((item) => item.length));
  const result: string[] = [];

  for (let i = 0; i < maxLength; i++) {
    let newString = "";
    for (let j = 0; j < arr.length; j++) {
      if (i < arr[j].length) newString += arr[j][i];
    }
    result.push(newString);
  }
  return result;
}

function distanceToReflection(pattern: string[], allowRepair?: boolean) {
  let rowsAboveReflection = 0;

  pattern.forEach((_, i) => {
    if (i == pattern.length - 1) return;
    let perfectmatch = false;
    let smudgeRepaired = false;

    const potentialReflection =
      pattern[i] == pattern[i + 1] ||
      differInOnePosition(pattern[i], pattern[i + 1]);

    if (potentialReflection) {
      let spread = 1;

      for (let j = i; j >= 0; j--) {
        const a = pattern[j];
        const b = pattern[j + spread];
        const repairPossible = differInOnePosition(a, b);

        if (a == b || (!smudgeRepaired && repairPossible && allowRepair)) {
          if (repairPossible) smudgeRepaired = true;
          if (j == 0 || j + spread == pattern.length - 1) perfectmatch = true;
          spread += 2;
        } else break;

        if (perfectmatch && (smudgeRepaired || !allowRepair))
          rowsAboveReflection += i + 1;
      }
    }
  });
  return rowsAboveReflection;
}

function differInOnePosition(str1?: string, str2?: string): boolean {
  if (!str1 || !str2) return false;
  if (str1.length !== str2.length) {
    return false;
  }

  let diffCount = 0;
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) {
      diffCount++;
      if (diffCount > 1) {
        return false;
      }
    }
  }
  return diffCount === 1;
}

const sum1 = patterns.reduce((acc, pattern) => {
  const hor = distanceToReflection(pattern);
  const vert = distanceToReflection(transformPatterns(pattern));
  return acc + 100 * hor + vert;
}, 0);

const sum2 = patterns.reduce((acc, pattern, i) => {
  const hor = distanceToReflection(pattern, true);
  const vert = distanceToReflection(transformPatterns(pattern), true);
  return acc + 100 * hor + vert;
}, 0);

console.log("🚀 ~ part1:", sum1); // 35521
console.log("🚀 ~ part2:", sum2); // 34795
