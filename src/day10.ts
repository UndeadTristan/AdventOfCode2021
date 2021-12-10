import { readFileSync } from 'fs';

console.log("Day 10");

const data = readFileSync("./data/day10.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);

const openSymbols = ['(', '[', '{', '<'];
const closeSymbols = [')', ']', '}', '>'];
const errorScores = [3, 57, 1197, 25137];
const incompleteScores = [];
let errorScore = 0;

lines.forEach(line => {
    const symbols = line.split('');
    const openIndexes = [];
    let syntaxError = false;

    for (let i = 0; i < symbols.length; ++i)
    {
        const symbol = symbols[i];
        let symbolIndex: number;
        if ((symbolIndex = openSymbols.indexOf(symbol)) > -1)
        {
            openIndexes.unshift(symbolIndex);
        }
        else if ((symbolIndex = closeSymbols.indexOf(symbol)) > -1)
        {
            const openIndex = openIndexes.shift();
            if (symbolIndex != openIndex)
            {
                // To calculate the syntax error score for a line, take the first illegal character on the line and use the error lookup table.
                errorScore += errorScores[symbolIndex];
                syntaxError = true;
                break;
            }
        }
    }

    // if line is valid but incomplete
    if (!syntaxError && openIndexes.length)
    {
        // for each character, multiply the total score by 5 and then increase the total score by the point value given
        incompleteScores.push(openIndexes.reduce((p, c) => p * 5 + c + 1, 0));
    }
});

console.log(`Syntax Error Score: ${errorScore}`);

// the winner is found by sorting all of the scores and then taking the middle score.
const incompleteScoresSorted = incompleteScores.sort((a,b) => a-b);
console.log("AutoComplete Winner Score: %d", incompleteScoresSorted[Math.round((incompleteScoresSorted.length - 1) / 2)]);
