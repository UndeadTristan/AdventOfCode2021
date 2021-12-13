import { readFileSync } from 'fs';

class PaperFolder
{
    readonly buffer: number[];
    readonly bufferSize = {w:0, h:0};
    readonly foldedSize = {w:0, h:0};

    constructor(dots: Array<{x:number, y:number}>)
    {
        dots.forEach(dot => {
            this.bufferSize.w = Math.max(dot.x + 1, this.bufferSize.w);
            this.bufferSize.h = Math.max(dot.y + 1, this.bufferSize.h);
        });
        this.foldedSize.w = this.bufferSize.w;
        this.foldedSize.h = this.bufferSize.h;

        this.buffer = new Array<number>(this.bufferSize.w * this.bufferSize.h).fill(null);
        dots.forEach(dot => this.buffer[this.bufferSize.w * dot.y + dot.x] = 1);
    }

    print()
    {
        for(let h=0; h < this.foldedSize.h; ++h)
        {
            const line = this.buffer.slice(this.bufferSize.w * h, this.bufferSize.w * h + this.foldedSize.w).map(p => p ? '#' : '.').join('');
            console.log(line);
        }
    }

    count()
    {
        let count = 0;
        for (let y=0; y < this.foldedSize.h; ++y)
        for (let x=0; x < this.foldedSize.w; ++x)
            this.buffer[this.bufferSize.w * y + x]?++count:null;
        return count;
    }

    printCount()
    {
        console.log(this.count());
    }

    foldX(fold: number)
    {
        for (let x = fold + 1; x < this.foldedSize.w; ++x)
        {
            const xFold = 2 * fold - x;
            for (let y = 0; y < this.foldedSize.h; ++y)
            {
                if (this.buffer[this.bufferSize.w * y + x])
                {
                    
                    this.buffer[this.bufferSize.w * y + xFold] = 1;
                }
            }
        }
        this.foldedSize.w = fold;
    }

    foldY(fold: number)
    {
        for (let y = fold + 1; y < this.foldedSize.h; ++y)
        {
            const yFold = 2 * fold - y; 
            for (let x = 0; x < this.foldedSize.w; ++x)
            {
                if (this.buffer[this.bufferSize.w * y + x])
                {
                    
                    this.buffer[this.bufferSize.w * yFold + x] = 1;
                }
            }
        }
        this.foldedSize.h = fold;
    }
}

console.log("Day 13");

const data = readFileSync("./data/day13.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);
const dots = [];
const instructions = [];

lines.forEach(line => {
    let match = line.match(/^.+([x|y])=(\d+)$/);
    if (match)
    {
        instructions.push({
            command: match[1], 
            value: parseInt(match[2], 10)
        });
    }
    else
    {
        const [x, y] = line.split(',').map(d => parseInt(d, 10));
        dots.push({x, y});
    }
});

let paperFolder = new PaperFolder(dots);

for (let i=0; i < instructions.length; ++i)
{
    const instruction = instructions[i];
    switch (instruction.command)
    {
        case 'x':
            paperFolder.foldX(instruction.value);
            break;

        case 'y':
            paperFolder.foldY(instruction.value);
            break;
    }
    paperFolder.printCount();
}

paperFolder.print();