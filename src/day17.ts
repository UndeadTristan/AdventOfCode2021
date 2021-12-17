import { readFileSync } from 'fs';

console.log("Day 17");

const data = readFileSync("./data/day17.dat", 'utf-8');
const match = data.match(/x=(-?\d+)..(-?\d+),\sy=(-?\d+)..(-\d+)/).slice(1, 5).map(d => parseInt(d));

const target = {
  xMin: Math.min(match[0], match[1]),
  xMax: Math.max(match[0], match[1]),
  yMin: Math.min(match[2], match[3]),
  yMax: Math.max(match[2], match[3])
};

const triNum = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120, 136, 153, 171, 190, 210, 231, 253, 276, 300, 325, 351, 378, 406, 435, 465, 496, 528, 561, 595, 630, 666];
function getTriNum(value: number): number {
  for (let i = 0; i < triNum.length; ++i) {
    if (triNum[i] > value) {
      return i;
    }
  }

  return triNum.length;
}


enum ProbeTest {
  Travel,
  Hit,
  Miss
}

class Probe {
  p: { x: number, y: number } = { x: 0, y: 0 };
  v: { x: number, y: number };
  s: number = 0;
  maxY: number = 0;

  constructor(x, y) {
    this.v = { x, y };
  }

  step() {
    // Increment the step count
    this.s++;

    // The probe's x position increases by its x velocity.
    this.p.x += this.v.x;

    // The probe's y position increases by its y velocity.
    this.p.y += this.v.y;

    // Record maximum Y value
    if (this.p.y > this.maxY)
    {
      this.maxY = this.p.y;
    }

    // Due to drag, the probe's x velocity changes by 1 toward the value 0; that is, 
    // it decreases by 1 if it is greater than 0, 
    // increases by 1 if it is less than 0, 
    // or does not change if it is already 0.
    if (this.v.x > 0) {
      this.v.x--;
    }
    else if (this.v.x < 0) {
      this.v.x++;
    }

    // Due to gravity, the probe's y velocity decreases by 1.
    this.v.y--;
  }

  test() {
    if (this.p.x >= target.xMin && this.p.x <= target.xMax &&
      this.p.y >= target.yMin && this.p.y <= target.yMax) {
      return ProbeTest.Hit;
    }

    if (this.p.y < target.yMin) {
      return ProbeTest.Miss;
    }

    return ProbeTest.Travel;
  }
}

let startX = getTriNum(target.xMin);
let startY = -1000;
let highestY = 0;
let result: ProbeTest;
let hits = [];
let max = 1000;

for (let y=startY; y < max; ++y)
for (let x=startX; x < max; ++x)
{
  const p = new Probe(x, y);
  while ((result = p.test()) == ProbeTest.Travel) {
    p.step();
  }

  if (result == ProbeTest.Hit) {
    hits.push([x,y]);
    highestY = Math.max(highestY, p.maxY);
  }
}

console.log(highestY);
console.log(hits.length);
console.log(JSON.stringify(hits));