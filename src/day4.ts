import { readFileSync, exists } from 'fs';

const BoardSize = 5;

class Board 
{
    rows: number[][];
    columns: number[][];

    constructor(boardValues: number[][]) 
    {
        this.rows = new Array();
        this.columns = new Array();

        for(let i=0; i < BoardSize; ++i)
        {
            this.rows.push(new Array());
            this.columns.push(new Array());
        }

        for(let y=0; y < boardValues.length; ++y)
        {
            const values = boardValues[y];
            for(let x=0; x < values.length; ++x)
            {
                try {
                    const value = values[x];
                    this.rows[y].push(value);
                    this.columns[x].push(value);
                }
                catch (ex)
                {
                    console.log(ex);
                }

            }
        }
    }

    checkBingo(calledNumbers: Array<number>): boolean
    {
        for(let i=0; i < BoardSize; ++i)
        {
            const row = this.rows[i];
            const column = this.columns[i];

            if (row.every(r=> calledNumbers.indexOf(r) >= 0) || column.every(c=> calledNumbers.indexOf(c) >= 0))
            {
                return true;
            }
        }

        return false;
    }

    calculateScore(calledNumbers: Array<number>): number
    {
        let sum = 0;

        for (let i=0; i < BoardSize; ++i)
        {
            sum += this.rows[i].reduce((p, c) => {
                return p + (calledNumbers.indexOf(c) >= 0 ? 0 : c)
            }, 0);
        }

        return sum * calledNumbers[calledNumbers.length-1];
    }
}

function parseInputAndBoards(filepath: string): [Array<number>, Array<Board>]
{
    const data = readFileSync(filepath, 'utf-8');
    const lines = data.split(/[\r\n]/);

    const puzzleInput = lines.shift().split(",").map(value => parseInt(value, 10));

    // empty line
    lines.shift();

    const boards = [];

    while(lines.length > 0) 
    {
        const boardValues = [];
        for (let line = lines.shift(); line && line.length > 0; line = lines.shift())
        {
            boardValues.push(line.trim().split(/\s+/).map(value => parseInt(value, 10)));
        }
        boards.push(new Board(boardValues));
    }

    return [puzzleInput, boards]
}

console.log("Day 4");

const [puzzleInput, boards] = parseInputAndBoards("./data/day4.dat");

for(let calledIndex=BoardSize; calledIndex < puzzleInput.length; ++calledIndex)
{
    const calledNumbers = puzzleInput.slice(0, calledIndex);
    for(let boardIndex=0; boardIndex < boards.length; ++boardIndex)
    {
        const board = boards[boardIndex];
        if (board.checkBingo(calledNumbers))
        {
            if (boards.length == 1) {
                console.log ("Last board to win score %d", board.calculateScore(calledNumbers));
                process.exit(0);
            }
            else {
                boards.splice(boardIndex, 1);
            }
        }
    }
}
 
