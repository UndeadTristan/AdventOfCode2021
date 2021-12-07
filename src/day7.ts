import { readFileSync } from 'fs';

function parseInput(filepath: string) : Array<number>
{
    const data = readFileSync(filepath, 'utf-8');

    return data.split(",").map(n => parseInt(n, 10));
}

const objs = parseInput("./data/day7.dat");

function calculateFuelCost(values, target)
{
    let fuelCost = 0;
    values.forEach(v => {
        let d = Math.abs(target - v);
        for (let i=0; i < d; ++i)
            fuelCost += i+1;
    });
    return fuelCost;
}

function findTarget(values, target) : number
{
    const targetCost = calculateFuelCost(values, target);

    if (targetCost > calculateFuelCost(values, target - 1)) 
    {
        return findTarget(values, target - 1);
    }
    else if (targetCost > calculateFuelCost(values, target + 1))
    {
        return findTarget(values, target + 1);
    }

    console.log(targetCost);

    return target;
}

const averageValue = objs.reduce((a, b) => a + b) / objs.length;

const target = findTarget(objs, averageValue);

console.log(target);