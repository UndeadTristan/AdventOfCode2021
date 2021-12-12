import { readFileSync } from 'fs';

console.log("Day 11");

const data = readFileSync("./data/day11.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);

const H = 10;
const W = 10;
const STEPS = 5000;

let flashes = 0;
let octopi = [];

lines.forEach(line => octopi = octopi.concat(line.split('').map(o => parseInt(o, 10))));

function flash(octopi: number[], x: number, y: number)
{
    octopi[y * W + x] = 0;

    let flashes = 1;

    for (let dy = y-1; dy <= y+1; ++dy)
    for (let dx = x-1; dx <= x+1; ++dx)
    {
        if (dx < 0 || dy < 0 || dx >= W || dy >= H)
        {
            continue;
        }

        const i = (dy) * W + dx;        

        if (octopi[i] == undefined || octopi[i] == 0)
        {
            continue;
        }

        if (++octopi[i] > 9)
        {
            flashes += flash(octopi, dx, dy);
        }
    }

    return flashes;
}

let step: number;
for (step = 0; step < STEPS; ++step)
{
    octopi.forEach((v, i, a) => a[i]++);

    for (let y = 0; y < H; ++y)
    for (let x = 0; x < W; ++x)
    {
        if (octopi[y * W + x] > 9)
        {
            flashes += flash(octopi, x, y);
        }
    }

    if (octopi.reduce((p,c) => p + c) == 0)
    {
        console.log(`Sync at step ${step+1}`);
        break;
    }
}

console.log(flashes);