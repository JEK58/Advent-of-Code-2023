import input from "./input.txt";

const hailstones = input
  .split("\n")
  .map((line) => line.replaceAll("@", ",").split(",").map(Number));

type Line = [number, number, number, number];

let part1 = 0;
while (hailstones.length) {
  const a = hailstones.shift();
  if (!a) continue;
  for (const b of hailstones) {
    if (a.join(",") === b.join(",")) continue;
    const line1 = [a[0], a[1], a[0] + a[3], a[1] + a[4]] as Line;
    const line2 = [b[0], b[1], b[0] + b[3], b[1] + b[4]] as Line;

    const res = findLineIntersection(line1, line2);
    if (!res) continue;

    // const min = 7;
    // const max = 27;
    const min = 200000000000000;
    const max = 400000000000000;
    // Skip intersections outside the search grid
    if (res.x >= max || res.x <= min || res.y >= max || res.y <= min) continue;

    //  Skip intersections in the past
    if (a[3] < 0 && res.x > line1[0]) continue;
    if (a[4] < 0 && res.y > line1[1]) continue;
    if (b[3] < 0 && res.x > line2[0]) continue;
    if (b[4] < 0 && res.y > line2[1]) continue;
    if (a[3] > 0 && res.x < line1[0]) continue;
    if (a[4] > 0 && res.y < line1[1]) continue;
    if (b[3] > 0 && res.x < line2[0]) continue;
    if (b[4] > 0 && res.y < line2[1]) continue;

    part1++;
  }
}

console.log("🚀 ~ part 1:", part1); // 20434

// http://paulbourke.net/geometry/pointlineplane/
function findLineIntersection(line1: Line, line2: Line, segmentsOnly = false) {
  const [x1, y1, x2, y2] = line1;
  const [x3, y3, x4, y4] = line2;

  // Filter line with length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) return false;

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Filter parallel lines
  // if (denominator === 0) console.log("Parallel line detected", line1, line2);
  if (denominator === 0) return false;

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // Optionally only find intersections inside the line segments
  if (segmentsOnly && (ua < 0 || ua > 1 || ub < 0 || ub > 1)) return false;

  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);

  return { x, y };
}
