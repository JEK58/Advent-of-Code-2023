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

const nodes: Position[] = [];

// Find nodes
nodes.push(start, end);
for (let r = 0; r < map.length; r++) {
  for (let c = 0; c < map[0].length; c++) {
    if (map[r][c] == "#") continue;
    const options = getDirections([r, c]);

    if (options.length > 2) nodes.push([r, c]);
  }
}

function getDirections(pos: Position) {
  const [r, c] = pos;
  return directions
    .map((dir) => {
      const [dr, dc] = dir;
      const nr = r + dr;
      const nc = c + dc;
      if (nc < 0 || nr < 0 || nr >= map.length || nc >= map[0].length) return;

      if (map[nr][nc] != "#") return [nr, nc];
      return false;
    })
    .filter(Boolean) as Position[];
}

type NodeDistance = [number, number, number];

const seen = new Set<string>();
function dfs(pos: Position, steps: number): NodeDistance[] {
  seen.add(pos.join(","));
  const dirs = getDirections(pos);
  const res = dirs
    .map(([r, c]) => {
      if (seen.has([r, c].join(","))) return; // skip seen (prev)
      if (r == pos[0] && c == pos[1]) return; // skip self
      // Detect node
      if (nodes.filter(([nr, nc]) => nr == r && nc == c).length > 0)
        return [r, c, steps] as NodeDistance;
      // Continue following the path
      return dfs([r, c], steps + 1)[0];
    })
    .filter(Boolean) as NodeDistance[];
  return res;
}

// Find connected nodes
const graph = new Map<string, NodeDistance[]>();
for (const node of nodes) {
  seen.clear();
  graph.set(node.join(","), dfs(node, 1));
}

// DFS for all nodes
let part2 = 0;
const visited = new Set<string>();
function solve(node: Position, steps: number) {
  visited.add(node.join(","));
  const options = graph.get(node.join(","));
  if (!options) return;
  options.forEach(([r, c, s]) => {
    if (r == end[0] && c == end[1]) return (part2 = Math.max(part2, steps + s)); // Found end
    if (visited.has([r, c].join(","))) return;

    solve([r, c], steps + s);
  });
  visited.delete(node.join(","));
}

solve(start, 0);

// TODO: Messy and slow: Optimize to improve performance
console.log("🚀 ~ part 2:", part2); // 6734
