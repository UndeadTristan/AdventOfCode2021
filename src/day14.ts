import { readFileSync } from 'fs';

console.log("Day 14");

const data = readFileSync("./data/day14.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);

let start = lines.shift();

function increment(map: Map<string, number>, key: string, n: number)
{
    if (map[key] === undefined)
    {
        map[key] = 0;
    }
    map[key] += n;
}

let polymer = new Map<string, number>();

for (let s=0; s < start.length-1; ++s)
{
    const key = start.substring(s, s+2);
    increment(polymer, key, 1);
}

const rules = new Map<string, []>();

lines.forEach(line => {
    const [r, v] = line.split(' -> ');
    rules[r] = [r[0]+v, v+r[1]];
});

const steps = 40;

for (let s=0; s < steps; ++s)
{
    let result = new Map<string, number>();

    for (let key in polymer)
    {
        if (rules[key])
        {
            const count = polymer[key];
            increment(result, rules[key][0], count);
            increment(result, rules[key][1], count);
        }
        else
        {
            result[key] = polymer[key];
        }
    }

    polymer = result;
}

const counts = new Map<string, number>();

for (const key in polymer) {
    const num = polymer[key];
    counts[key[0]] = counts[key[0]] ? counts[key[0]] + num : num;
    counts[key[1]] = counts[key[1]] ? counts[key[1]] + num : num;
}

console.log(counts);