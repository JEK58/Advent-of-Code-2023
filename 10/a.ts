import input from "./input.txt";

type Position = [number, number];

const map = input.split("\n").map((set) => {
  return set.split("");
});

const [startX, startY] = map
  .flatMap((row, y) => {
    const x = row.findIndex((col) => col === "S");
    if (x > -1) return [x, y];
  })
  .filter(Number.isInteger) as Position;

if (!Number.isInteger(startX) || !Number.isInteger(startY))
  throw new Error("No start found");

const start: Position = [startX, startY];
const connections = new Set<string>();

const startConnections = findStartConnections(start);

// Part 1
let current = startConnections[0];
let prev = start;
connections.add(current.join(",")); // add first connection

while (true) {
  const next = findConnection(current, prev);
  if (!next) break;
  connections.add(next.join(","));
  prev = current;
  current = next;
}

// Part 2
let inside = false;
let insideCount = 0;

map[startY][startX] = determinStartTile(startConnections);

map.forEach((row, y) => {
  row.forEach((tile, x) => {
    const isLoopPart = connections.has(`${x},${y}`);
    if (!isLoopPart && inside) insideCount++;
    if (isLoopPart && ["|", "7", "F"].includes(tile)) inside = !inside;
  });
});

// Part 2 with shoelace formula and Pick's theorem
const vertices = Array.from(connections).map((v) => v.split(",").map(Number));
const numVertices = vertices.length;
let sum1 = 0;
let sum2 = 0;

for (let i = 0; i < numVertices - 1; i++) {
  sum1 = sum1 + vertices[i][0] * vertices[i + 1][1];
  sum2 = sum2 + vertices[i][1] * vertices[i + 1][0];
}
// Add the last vertex with the first one
sum1 = sum1 + vertices[numVertices - 1][0] * vertices[0][1];
sum2 = sum2 + vertices[0][0] * vertices[numVertices - 1][1];

const area = Math.abs(sum1 - sum2) / 2;

// Pick's theroem: A = i + b / 2 - 1 => i = A - b / 2 + 1
const count = area - connections.size / 2 + 1;

console.log("🚀 ~ part 1:", connections.size / 2); // 6890
console.log("🚀 ~ part 2:", insideCount); // 453
console.log("🚀 ~ part 2 (shoelace):", count); // 453

function determinStartTile(positions: Position[]) {
  const [a, b] = [
    positions[0][0] - positions[1][0],
    positions[0][1] - positions[1][1],
  ];

  if (a == -1 && b == 1) return "F";
  if (a == -2 && b == 0) return "-";
  if (a == 1 && b == 1) return "7";
  if (a == 0 && b == -2) return "|";
  if (a == -1 && b == -1) return "L";
  if (a == 1 && b == -1) return "J";
  else throw new Error("No start tile found");
}

function findConnection([x, y]: Position, prev: Position) {
  const tile = map[y][x];
  const adjacent: Position[] = [
    [x, y - 1], // top
    [x, y + 1], // bottom
    [x - 1, y], // left
    [x + 1, y], // right
  ];
  let bar: Position[] = [];
  if (tile == "S") return;
  if (tile == "|") bar.push(...[adjacent[0], adjacent[1]]);
  if (tile == "-") bar.push(...[adjacent[2], adjacent[3]]);
  if (tile == "L") bar.push(...[adjacent[0], adjacent[3]]);
  if (tile == "J") bar.push(...[adjacent[0], adjacent[2]]);
  if (tile == "7") bar.push(...[adjacent[1], adjacent[2]]);
  if (tile == "F") bar.push(...[adjacent[1], adjacent[3]]);

  if (bar.length > 2) throw new Error("More than two possible connections");

  return bar.filter(([x, y]) => !(x == prev[0] && y == prev[1]))[0];
}

function findStartConnections([x, y]: Position) {
  const connections: Position[] = [];
  const adjacent = [
    [x, y - 1], // top
    [x, y + 1], // bottom
    [x - 1, y], // left
    [x + 1, y], // right
  ];
  adjacent.forEach(([x, y], i) => {
    if (x < 0 || y < 0) return;
    const tile = map[y][x];
    if (i == 0 && ["|", "7", "F"].includes(tile)) connections.push([x, y]);
    if (i == 1 && ["|", "J", "L"].includes(tile)) connections.push([x, y]);
    if (i == 2 && ["-", "F", "L"].includes(tile)) connections.push([x, y]);
    if (i == 3 && ["-", "J", "7"].includes(tile)) connections.push([x, y]);
  });

  if (connections.length > 2)
    throw new Error("More than two possible connections");

  return connections;
}
