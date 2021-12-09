import { readFileSync } from 'fs';

console.log("Day 9");

const data = readFileSync("./data/day9.dat", 'utf-8');
const map = data.split(/[\r\n]+/).map(line => line.split('').map(s => parseInt(s, 10)));

function basinSize(map, x, y, c): number
{
    // Locations of height 9 do not count as being in any basin, and all other locations will always be part of exactly one basin.
    if (c[`${x},${y}`] || 
        map[y] === undefined || 
        map[y][x] === undefined || 
        map[y][x] == 9)
    {
        return 0;
    }

    c[`${x},${y}`] = 1;

    return 1 +
        basinSize(map, x+1, y, c) + 
        basinSize(map, x-1, y, c) + 
        basinSize(map, x, y+1, c) + 
        basinSize(map, x, y-1, c);
}

let sumRiskLevel = 0;
let basins = [];
for(let y=0; y < map.length; ++y)
for(let x=0; x < map[y].length; ++x)
{
    let v = map[y][x];

    if ((map[y][x+1] === undefined || map[y][x+1] > v) &&
        (map[y][x-1] === undefined || map[y][x-1] > v) &&
        (map[y+1] === undefined || map[y+1][x] > v) &&
        (map[y-1] === undefined || map[y-1][x] > v))
    {
        sumRiskLevel += v + 1;
        basins.push(basinSize(map, x, y, []));
    }
}

console.log(sumRiskLevel);

// Find the three largest basins and multiply their sizes together.
const largestProduct = basins.sort((a,b) => b - a).slice(0, 3).reduce((p,c) => p * c);
console.log(largestProduct);
