import { readFileSync } from 'fs';

function subSegments(a: string, b: string): string
{
    return a.split('').filter(l => b.indexOf(l) < 0).join('');
}

console.log("Day 8");

const data = readFileSync("./data/day8.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);

let count = 0;

lines.forEach(line => {
    const signals = {};
    const numbers = {};
    const [inputs, outputs] = line.split(" | ");
    const fives = [];
    const sixes = [];
    inputs
        .split(" ")
        .sort((a, b) => b.length - a.length)
        .map(i => {
        i = i.split('').sort().join('');
        switch(i.length)
        {
            case 2:
                signals[i] = 1;
                numbers[1] = i;
                break;
            
            case 3:
                signals[i] = 7;
                numbers[7] = i;
                break;

            case 4:
                signals[i] = 4;
                numbers[4] = i;
                break;

            case 5: // 2, 3, 5
                fives.push(i);
                break;

            case 6: // 0, 6, 9
                sixes.push(i);
                break;

            case 7:
                signals[i] = 8;
                numbers[8] = i;
                break;
        }
    });

    fives.forEach((three, i) => {
        if (subSegments(numbers[1], three).length == 0)
        {
            signals[three] = 3;
            numbers[3] = three;
            fives.splice(i, 1);
        }
    });

    fives.forEach((five, i) => {
        if (subSegments(subSegments(five, numbers[3]), numbers[4]).length == 0)
        {
            signals[five] = 5;
            numbers[5] = five;
            fives.splice(i, 1);
        }
    });

    const two = fives[0];
    signals[two] = 2;
    numbers[2] = two;

    sixes.forEach((nine, i) => {
        if (subSegments(subSegments(nine, numbers[5]), numbers[1]).length == 0)
        {
            signals[nine] = 9;
            numbers[9] = nine;
            sixes.splice(i, 1);
        }
    });

    sixes.forEach((zero, i) => {
        if (subSegments(numbers[5], zero).length == 1)
        {
            signals[zero] = 0;
            numbers[0] = zero;
            sixes.splice(i, 1);
        }
    });

    const six = sixes[0];
    signals[six] = 6;
    numbers[6] = six;

    let strValue = outputs.split(" ").reduce((p, c) => p + signals[c.split('').sort().join('')], "");

    console.log(strValue);
    const value = parseInt(strValue, 10);
    count += value;
});

console.log(count);