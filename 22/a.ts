import input from "./input.txt";

type Position = [number, number, number];
type Brick = [Position, Position, string];

// @ts-ignore
const bricks = input.split("\n").map((line, i) => {
  return [
    ...(line.split("~").map((p) => p.split(",").map(Number)) as Brick),
    i.toString(),
  ];
}) as Brick[];

bricks.sort((a, b) => {
  return a[0][2] - b[0][2];
});

// prettier-ignore
let dimX = 0, dimY = 0, dimZ = 0

for (const brick of bricks) {
  dimX = Math.max(dimX, brick[0][0], brick[1][0]);
  dimY = Math.max(dimY, brick[0][1], brick[1][1]);
  dimZ = Math.max(dimZ, brick[0][2], brick[1][2]);
}

const stack = Array.from({ length: dimZ + 1 }, () =>
  Array.from({ length: dimY + 1 }, () => Array(dimX + 1).fill("."))
) as string[][][];

// Collapse all items onto each other
for (const brick of bricks) {
  for (let zi = dimZ; zi > 0; zi--) {
    const elements = brickToElements(brick);
    const collision = detectCollision(elements, zi);

    let zDir = 0;
    if (brick[0][2] != brick[1][2]) zDir = brick[1][2] - brick[0][2];

    if (collision && zDir === 0) {
      elements.forEach(([x, y, _]) => (stack[zi + 1][y][x] = brick[2]));
      break;
    } else if (collision && zDir !== 0) {
      elements.forEach(([x, y, z], i) => (stack[zi + i + 1][y][x] = brick[2]));
      break;
    } else if (zi == 1 && zDir === 0) {
      elements.forEach(([x, y, z]) => (stack[zi][y][x] = brick[2]));
      break;
    } else if (zi == 1 && zDir !== 0) {
      elements.forEach(([x, y, z], i) => (stack[zi + i][y][x] = brick[2]));
      break;
    }
  }
}

const elements = new Set<string>();
const supportedByList = new Map<string, string[]>();
const supportingList = new Map<string, string[]>();

// Find which element supports which and also store which elements are supported by which
for (let z = 1; z <= dimZ; z++) {
  for (let y = 0; y <= dimY; y++) {
    for (let x = 0; x <= dimX; x++) {
      const id = stack[z][y][x];
      if (id === ".") continue;
      elements.add(id);
      const support = stack[z - 1][y][x];
      if (support === "." || support === id) continue;
      supportedByList.set(id, [
        ...new Set([...(supportedByList.get(id) ?? []), support]),
      ]);
      supportingList.set(support, [
        ...new Set([...(supportingList.get(support) ?? []), id]),
      ]);
    }
  }
}

// Find the elements that are essential for the integrity of the structure
const essentialElements = new Set<string>();
elements.forEach((id) => {
  supportedByList.forEach((support) => {
    if (support.includes(id) && support.length === 1) essentialElements.add(id);
  });
});

// Part 2
// Find how many elements collapse when desintegrating each element
let part2 = 0;

for (const item of elements) {
  const supportedByListInt = new Map<string, string[]>([...supportedByList]);
  const fallen = new Set<string>();
  const q: string[] = [item];

  while (q.length > 0) {
    const elId = q.shift();
    if (!elId) break;

    const el = supportingList.get(elId);

    el?.forEach((id) => {
      supportedByListInt.set(
        id,
        (supportedByListInt.get(id) ?? [])?.filter((el) => el !== elId)
      );
      if (supportedByListInt.get(id)?.length == 0) {
        q.push(id);
        fallen.add(id);
      }
    });
  }
  part2 += fallen.size;
}

const part1 = elements.size - essentialElements.size;
console.log("🚀 ~ part1:", part1); // 443
console.log("🚀 ~ part 2:", part2); // 69915

function detectCollision(positions: Position[], z: number) {
  for (const position of positions) {
    const [x, y] = position;
    if (stack[z][y][x] !== ".") return true;
  }
  return false;
}

function brickToElements(brick: Brick) {
  const [[xa, ya, za], [xb, yb, zb]] = brick;
  const el: Position[] = [];
  if (xa != xb) for (let x = xa; x <= xb; x++) el.push([x, ya, za]);
  if (ya != yb) for (let y = ya; y <= yb; y++) el.push([xa, y, za]);
  if (za != zb) for (let z = za; z <= zb; z++) el.push([xa, ya, z]);
  if (xa == xb && ya == yb && za == zb) el.push([xa, ya, za]); // Single element bricks
  return el;
}
