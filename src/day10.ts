import { readFileSync } from 'fs';

console.log("Day 10");

const data = readFileSync("./data/day10.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);

const openSymbols = new Array('(', '[', '{', '<');
const closeSymbols = new Array(')', ']', '}', '>');
const errorScores = [3, 57, 1197, 25137];

let errorScore = 0;
let incompleteScores = [];

lines.forEach(line => {
    const symbols = line.split('');
    const openIndexes = [];
    let syntaxError = false;

    for (let i = 0; i < symbols.length; ++i)
    {
        const symbol = symbols[i];
        let symbolIndex;
        if ((symbolIndex = openSymbols.indexOf(symbol)) > -1)
        {
            openIndexes.unshift(symbolIndex);
        }
        else if ((symbolIndex = closeSymbols.indexOf(symbol)) > -1)
        {
            const openIndex = openIndexes.shift();
            if (symbolIndex != openIndex)
            {
                errorScore += errorScores[symbolIndex];
                syntaxError = true;
                break;
            }
        }
    }

    if (!syntaxError)
    {
        let incompleteScore = 0;
        for (let i=0; i < openIndexes.length; ++i)
        {
            incompleteScore *= 5;
            incompleteScore += openIndexes[i] + 1;
        }
        incompleteScores.push(incompleteScore);
    }
});

console.log(`Syntax Error Score: ${errorScore}`);

// the winner is found by sorting all of the scores and then taking the middle score.
const incompleteScoresSorted = incompleteScores.sort((a,b) => a-b);
console.log("AutoComplete Winner Score: %d", incompleteScoresSorted[Math.round((incompleteScoresSorted.length - 1) / 2)]);
