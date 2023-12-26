import input from "./input.txt";
import { findLineIntersection } from "../utils/utils";

const hailstones = input
  .split("\n")
  .map((line) => line.replaceAll("@", ",").split(",").map(Number)) as Hail[];

let part1 = 0;
const hailstonesCopy = [...hailstones];
while (hailstonesCopy.length) {
  const a = hailstonesCopy.shift();
  if (!a) continue;
  for (const b of hailstonesCopy) {
    if (a.join(",") === b.join(",")) continue;
    const line1 = [a[0], a[1], a[0] + a[3], a[1] + a[4]] as Line;
    const line2 = [b[0], b[1], b[0] + b[3], b[1] + b[4]] as Line;

    const res = findLineIntersection(line1, line2);

    if (!res) continue;

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

// Part 2
type Hail = [number, number, number, number, number, number];
type Line = [number, number, number, number];

const MAX_V = 500;

// Find hail pairs that have the same velocity
const hailWithCommonVelocity: {
  x: [Hail, Hail][];
  y: [Hail, Hail][];
  z: [Hail, Hail][];
} = { x: [], y: [], z: [] };

for (let i = 0; i < hailstones.length; i++) {
  for (let j = i + 1; j < hailstones.length; j++) {
    const a = hailstones[i];
    const b = hailstones[j];
    if (a[3] === b[3]) hailWithCommonVelocity.x.push([a, b]);
    if (a[4] === b[4]) hailWithCommonVelocity.y.push([a, b]);
    if (a[5] === b[5]) hailWithCommonVelocity.z.push([a, b]);
  }
}

// Reduce the possible velocities to the ones that are common to all pairs
// There must be exactly one result for each axis
const axes = ["x", "y", "z"] as const;
const velocities = axes.flatMap((axis) => {
  const vel: number[] = [];
  for (const h of hailWithCommonVelocity[axis]) {
    const res = getVelocities(h, axis);
    if (vel.length === 0) vel.push(...res);
    else {
      const temp = [...vel];
      vel.length = 0;
      for (const t of temp) {
        if (res.includes(t)) vel.push(t);
      }
    }
  }
  return vel;
});

// Given that the rock would be stationary the velocities of the hailstones are corrected by the rock velocity
// Relative velocity between rock and hail would be the same
function getVelocities(hailstones: number[][], axis: "x" | "y" | "z") {
  let d = 0;
  if (axis === "y") d = 1;
  if (axis === "z") d = 2;

  const [hailA, hailB] = hailstones;
  const possibleVelocities = new Set<number>();
  for (let v = -MAX_V; v < MAX_V; v++) {
    if (checkRockV(v, hailA[3 + d], hailA[0 + d] - hailB[0 + d]))
      possibleVelocities.add(v);
  }
  return [...possibleVelocities];
}

function checkRockV(rv: number, hv: number, dist: number) {
  return dist % (rv - hv) === 0;
}

const [rvx, rvy, rvz] = velocities;

if (!rvx || !rvy || !rvz) throw new Error("No velocity found for some axes");

// From the velocity of the rock we can calculate the rock starting position
// It's the same principle as in part 1
const [xa, ya, za, vxa, vya, vza] = hailstones[0];
const [xb, yb, zb, vxb, vyb, vzb] = hailstones[1];
const line1 = [xa, ya, xa + vxa - rvx, ya + vya - rvy] as Line;
const line2 = [xb, yb, xb + vxb - rvx, yb + vyb - rvy] as Line;

const xy = findLineIntersection(line1, line2);

const line3 = [ya, za, ya + vya - rvy, za + vza - rvz] as Line;
const line4 = [yb, zb, yb + vyb - rvy, zb + vzb - rvz] as Line;

const yz = findLineIntersection(line3, line4);

if (!xy || !yz) throw new Error("No intersection found");

console.log("🚀 ~ part 1:", part1); // 20434
console.log("🚀 ~ Part 2:", xy.x + xy.y + yz.y); // 1025127405449117
