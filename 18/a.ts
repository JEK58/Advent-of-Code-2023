import input from "./input.txt";

const instructions = input.split("\n").map((line) => line.split(" "));

// prettier-ignore
const directions = new Map([["R", [1,0]],["L", [-1,0]],["D", [0,1]],["U", [0,-1]]])

let currPos = [0, 0];
const vertices: [number, number][] = [];
let boundaryPoints = 0;

instructions.forEach(([dir, dist]) => {
  const delta = directions.get(dir);
  if (!delta) throw new Error("Invalid direction");
  boundaryPoints += +dist;
  currPos = [currPos[0] + delta[0] * +dist, currPos[1] + delta[1] * +dist];
  vertices.push([currPos[0], currPos[1]]);
});

// shoelace formula
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

// Pick's theorem: A = i + b / 2 - 1 => i = A - b / 2 + 1
const count = area - boundaryPoints / 2 + 1;

console.log("🚀 ~ part 1:", count + boundaryPoints); // 47527
