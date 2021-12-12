import { readFileSync } from 'fs';

class Cave
{
    readonly name: string;
    readonly isBigCave: boolean;
    readonly connections = new Array<Cave>();

    constructor(name: string)
    {
        this.name = name;
        this.isBigCave = /[A-Z]/.test(name);
    }
}

class CaveMap
{
    readonly map = new Map<string, Cave>();

    get(name: string): Cave 
    {
        if (this.map.has(name) === false)
        {
            this.map.set(name, new Cave(name));
        }

        return this.map.get(name);
    }

    addConnection(a: string, b: string)
    {
        const caveA = this.get(a);
        const caveB = this.get(b);
        caveA.connections.push(caveB);
        caveB.connections.push(caveA);
    }

    countPathsRecursive(path: Cave[], startCave: Cave, endCave: Cave, canDoubleVisit: boolean): number
    {
        let count = 0;
        const current = path[path.length-1];
        current.connections.forEach(next => {
            if (next == startCave)
            {
                // Can't revist the start
            }
            else if (next == endCave)
            {
                // Found the end cave. Count it.
                count++;
            }
            else if (next.isBigCave || path.indexOf(next) == -1)
            {
                // Big cave or unvisited small cave.
                count += this.countPathsRecursive(path.concat([next]), startCave, endCave, canDoubleVisit);
            }
            else if (canDoubleVisit)
            {
                // We're allowed to revisit a small cave once
                count += this.countPathsRecursive(path.concat([next]), startCave, endCave, false);
            }
        });

        return count;
    }

    countPaths(start: string, end: string, canDoubleVisit: boolean): number
    {
        const startCave = this.get(start);
        const endCave = this.get(end);
        return this.countPathsRecursive([startCave], startCave, endCave, canDoubleVisit);
    }
}

const data = readFileSync("./data/day12.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);
const caveMap = new CaveMap;

lines.forEach(line => {
    const [a, b] = line.split('-');
    caveMap.addConnection(a, b);
});

console.log("Day 12");

{
    const pathCount = caveMap.countPaths('start', 'end', false);
    console.log(`Paths through the caves: ${pathCount}`);
}

{
    const pathCount = caveMap.countPaths('start', 'end', true);
    console.log(`Paths with double visits allowed: ${pathCount}`);
}
