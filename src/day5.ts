import { strict as assert } from 'assert';
import { readFileSync } from 'fs';

const MapSize = 1000;

class Point
{
    x: number;
    y: number;

    constructor(x: string, y: string)
    {
        this.x = parseInt(x, 10);
        this.y = parseInt(y, 10);
    }
}

class Line
{
    p1: Point;
    p2: Point;

    constructor(p1: Point, p2: Point)
    {
        this.p1 = p1;
        this.p2 = p2;
    }
}

class Diagram
{
    map: Array<number>;

    constructor()
    {
        this.map = Array<number>(MapSize * MapSize).fill(0);
    }

    AddLineToMap(line: Line)
    {
        if (line.p1.x == line.p2.x)
        {
            const x = line.p1.x;
            const start = Math.min(line.p1.y, line.p2.y);
            const end = Math.max(line.p1.y, line.p2.y);
            for (let y=start; y <= end; ++y)
            {
                this.map[y * MapSize + x]++;
            }
        }
        else if (line.p1.y == line.p2.y)
        {
            const y = line.p1.y;
            const start = Math.min(line.p1.x, line.p2.x);
            const end = Math.max(line.p1.x, line.p2.x);
            for (let x=start; x <= end; ++x)
            {
                this.map[y * MapSize + x]++;
            }
        }
        else
        {
            const dirx = line.p1.x < line.p2.x ? 1:-1;
            const diry = line.p1.y < line.p2.y ? 1:-1;
            for (let y=line.p1.y, x=line.p1.x; y != line.p2.y + diry; y += diry, x += dirx)
            {
                this.map[y * MapSize + x]++;
            }
        }
    }

    numOverlapPoints(): number
    {
        return this.map.reduce((p, c) => p + (c >= 2 ? 1 : 0), 0);
    }
}

function parseInput(filepath: string): Array<Line>
{
    const data = readFileSync(filepath, 'utf-8');
    const linesData = data.split(/[\r\n]/);

    const lines = [];

    for (let i=0; i < linesData.length; ++i)
    {
        const lineData = linesData[i];
        const match = lineData.match(/^(\d+),(\d+)\s->\s(\d+),(\d+)$/);
        assert(match.length == 5, "Invalid data");

        lines.push(new Line(new Point(match[1], match[2]), new Point(match[3], match[4])));
    }

    return lines;
}

console.log("Day 5");

const lines = parseInput("./data/day5.dat");
const diagram = new Diagram;

for(let l=0; l < lines.length; ++l)
{
    const line = lines[l];
    diagram.AddLineToMap(line);
}

console.log(diagram.numOverlapPoints());