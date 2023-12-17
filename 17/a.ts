import input from "./input.txt";
import { Heap } from "heap-js";

const map = input.split("\n").map((line) => line.split(""));

const visited = new Set<string>();

type QueueItem = [number, number, number, number, number, number];
const customPriorityComparator = (a: QueueItem, b: QueueItem) => a[0] - b[0];
const heap = new Heap<QueueItem>(customPriorityComparator);

heap.init([[0, 0, 0, 0, 0, 0]]);

// TODO: Fully understand why this works
while (heap.length) {
  const next = heap.pop();

  if (!next) break;

  const [hl, x, y, dx, dy, steps] = next;

  if (x === map[0].length - 1 && y === map.length - 1) {
    console.log("Reached the end", hl); // 1238
    break;
  }

  if (visited.has([x, y, dx, dy, steps].join(","))) continue;

  visited.add([x, y, dx, dy, steps].join(","));

  if (steps < 3 && `${dx}:${dy}` != `0:0`) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < map[0].length && ny >= 0 && ny < map.length) {
      heap.push([hl + +map[ny][nx], nx, ny, dx, dy, steps + 1]);
    }
  }

  // prettier-ignore
  for (const [ndx, ndy] of [[0, 1], [0, -1], [1, 0],[-1, 0],]) {
    if (
      `${ndx}:${ndy}` != `${dx}:${dy}` &&
      `${ndx}:${ndy}` != `${-dx}:${-dy}`
    ) {
      const nx = x + ndx;
      const ny = y + ndy;
      if (nx >= 0 && nx < map[0].length && ny >= 0 && ny < map.length) {
        heap.push([hl + +map[ny][nx], nx, ny, ndx, ndy, 1]);
      }
    }
  
  }
}
