import { readFileSync } from 'fs';

const DaysToCalculate = 256;

function parseInput(filepath: string): Array<number>
{
    const data = readFileSync(filepath, 'utf-8');
    const input = data.split(",").map(d => parseInt(d, 10));

    const lanternfishes = new Array<number>(9).fill(0);

    input.forEach(i => lanternfishes[i]++);

    return lanternfishes;
}

const lanternfishes = parseInput("./data/day6.dat");
for(let day = 0; day < DaysToCalculate; ++day)
{
    let fishSpawning = lanternfishes.shift();
    lanternfishes[6] += fishSpawning;
    lanternfishes[8] = fishSpawning;

    console.log("Larnetfish after %d days: %d", day+1, lanternfishes.reduce((p, c) => p + c, 0));
}


