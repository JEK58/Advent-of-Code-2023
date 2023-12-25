import input from "./input.txt";

const lines = input.split("\n").map((line) =>
  line
    .replace(":", "")
    .split(" ")
    .map((el) => el.trim())
);

let graph = new Map<string, Set<string>>();
for (const line of lines) {
  const id = line.shift();
  if (!id) continue;

  if (!graph.has(id)) graph.set(id, new Set<string>());
  const set = graph.get(id);
  if (!set) continue;
  line.forEach((el) => set?.add(el));

  line.forEach((el) => {
    if (!graph.has(el)) graph.set(el, new Set<string>());
    const set = graph.get(el);
    if (!set) return;
    set.add(id);
  });
}

// bfs
type Graph = Map<string, Set<string>>;
function shortestPath(graph: Graph, start: string, target: string) {
  const queue: string[][] = [[start]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const path = queue.shift() as string[];
    const node = path[path.length - 1];

    if (node === target) return path; // target found

    if (!visited.has(node)) {
      visited.add(node);
      const neighbors = graph.get(node) || [];

      for (const neighbor of neighbors) {
        const newPath = [...path, neighbor];
        queue.push(newPath);
      }
    }
  }
  return null;
}

function findBridge(start: string) {
  const seen = new Set<string>();
  let current = start;
  while (true) {
    const next = findHotNodes(current);
    if (seen.has(next)) {
      return [next, current];
    }
    seen.add(next);
    current = next;
  }
}

function findHotNodes(start: string) {
  const nodes = [...graph.keys()];
  const paths = nodes.map((target) => shortestPath(graph, start, target));
  const frequencyMap = new Map<string, number>();
  for (const path of paths) {
    path?.forEach((node) => {
      const count = frequencyMap.get(node) || 0;
      frequencyMap.set(node, count + 1);
    });
  }

  return [...frequencyMap].sort((a, b) => b[1] - a[1])[1][0]; // ignore first node and return second
}

function deleteConnection(connection: string[]) {
  const [a, b] = connection;
  const setA = graph.get(a);
  if (!setA) throw new Error("set not found");
  setA.delete(b);

  const setB = graph.get(b);
  if (!setB) throw new Error("set not found");
  setB.delete(a);
}

const nodes = [...graph.keys()];

const start = nodes[0];
const bridge1 = findBridge(start);
deleteConnection(bridge1);
const bridge2 = findBridge(start);
deleteConnection(bridge2);
const bridge3 = findBridge(start);
deleteConnection(bridge3);

const reachable = nodes
  .map((node) => shortestPath(graph, nodes[0], node))
  .filter(Boolean).length;

const part1 = reachable * (nodes.length - reachable);
console.log("🚀 ~ part1:", part1); // 514786
