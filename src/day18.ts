import { assert } from 'console';
import { readFileSync } from 'fs';

function parseLine(line: string): any[]
{
    const result = [];
    for (let i=0; i < line.length; ++i)
    {
        let match: RegExpMatchArray;
        let str = line.substring(i);
        if (match = str.match(/^([\[|\,|\]])/))
        {
            result.push(match[1]);
        }
        else if (match = str.match(/^(\d+)/))
        {
            result.push(parseInt(match[1]));
        }
    }
    return result;
}

function add(a: any[], b: any[]): any[]
{
    const r = ['[', ...a, ',', ...b, ']'];
    let continueReduce = true;
    while(continueReduce)
    {
        continueReduce = false;

        // Explode
        let depth = 0;
        for (let i=0; i < r.length-2; ++i)
        {
            if (r[i] == '[') depth++;
            else if (r[i] == ']') depth--;
            else if (depth > 4 && Number.isInteger(r[i]) && r[i+1] == ',' && Number.isInteger(r[i+2]))
            {
                for (let j=i-1; j >= 0; --j)
                {
                    if (Number.isInteger(r[j]))
                    {
                        r[j] += r[i];
                        break;
                    }
                }
                for (let j=i+3; j < r.length; ++j)
                {
                    if (Number.isInteger(r[j]))
                    {
                        r[j] += r[i+2];
                        break;
                    }
                }
                r.splice(i-1, 5, 0);
                continueReduce = true;
                break;
            }
        }

        if (continueReduce)
        {
            continue;
        }

        // Split
        for (let i=0; i < r.length; ++i)
        {
            if (r[i] > 9)
            {
                const split = r[i] / 2;
                r.splice(i, 1, '[', Math.floor(split), ',', Math.ceil(split), ']');
                continueReduce = true;
                break;
            }
        }
    }

    // console.log(`  ${a.join('')}`);
    // console.log(`+ ${b.join('')}`);
    // console.log(`= ${r.join('')}`);
    // console.log('');

    return r;
}

// The magnitude of a pair is 3 times the magnitude of its left element plus 2 times the magnitude of its right element. 
// The magnitude of a regular number is just that number.
function magnitude(pair: any[]): number
{
    return (Array.isArray(pair[0]) ? magnitude(pair[0]) : pair[0]) * 3 +
           (Array.isArray(pair[1]) ? magnitude(pair[1]) : pair[1]) * 2;
}

console.log("Day 18");

const data = readFileSync("./data/day18.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);

const numbers = [];
for(let line of lines)
{
    numbers.push(parseLine(line));
}

let sum = numbers[0];
for (let i=1; i < numbers.length; ++i)
{
    sum = add(sum, numbers[i]);
}

const jsonStr = sum.join('');
const result = JSON.parse(jsonStr);
const mag = magnitude(result);

console.log(mag);

const mags = numbers.flatMap(
    (v, i) => numbers.slice(i+1).map( w => {
        const result = JSON.parse(add(v, w).join(''));
        return magnitude(result);
    }) 
);

console.log(Math.max(...mags));

