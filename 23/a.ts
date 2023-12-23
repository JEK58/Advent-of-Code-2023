import input from "./input.txt";

type Position = [number, number];
const map = input.split("\n").map((line) => line.split(""));

const start: Position = [0, 1];
const end: Position = [map.length - 1, map[0].length - 2];

type Direction = [number, number, "<" | ">" | "^" | "v"];
const directions: Direction[] = [
  [0, 1, ">"],
  [0, -1, "<"],
  [1, 0, "v"],
  [-1, 0, "^"],
];

const visited = new Set<string>();
const path = new Map<string, number>();

function navigate(pos: Position, _visited: Set<string>): number[] {
  console.log(path.get(pos.join(",")));

  // if (path.has(pos.join(",")) && path.get(pos.join(",")) > _visited.size)
  //   return [];
  const visited = new Set([..._visited, pos.join(",")]);

  path.set(pos.join(","), visited.size);
  const options = getOptions(pos);

  return options
    .map((option) => {
      const key = option.join(",");
      if (option.join(",") === end.join(",")) return visited.size;
      if (visited.has(key)) return;
      return navigate(option, visited);
    })
    .flat()
    .filter(Number) as number[];
}

function getOptions(pos: Position) {
  const [r, c] = pos;
  return directions
    .map((dir) => {
      const [dr, dc, sl] = dir;
      const nr = r + dr;
      const nc = c + dc;
      if (nc < 0 || nr < 0 || nr >= map.length || nc >= map[0].length) return;

      // if (map[nr][nc] === "." || map[nr][nc] === sl) {
      //   return [nr, nc];
      // }
      if (map[nr][nc] != "#") return [nr, nc];
    })
    .filter(Boolean) as Position[];
}

const steps = navigate(start, visited);
const part1 = Math.max(...steps);
console.log("🚀 ~ part1:", part1); // 2278
