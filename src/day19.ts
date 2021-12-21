import { assert } from 'console';
import { readFileSync } from 'fs';

class Vector
{
    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number, y: number, z: number)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(rhs: Vector): Vector
    {
        return new Vector(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
    }

    sub(rhs: Vector): Vector
    {
        return new Vector(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
    }

    rotate(orientation: number)
    {
        const dir = Math.floor(orientation / 4);
        const rot = orientation % 4;

        let x = this.x;
        let y = this.y;
        let z = this.z;

        switch (dir)
        {
            // Forward
            case 0:
                // No change
                break;

            // Up
            case 1:
                [y, z] = [z, -y];
                break;

            // Down
            case 2:
                [y, z] = [-z, y];
                break;

            // Left
            case 3:
                [x, z] = [-z, x];
                break;

            // Right
            case 4:
                [x, z] = [z, -x];
                break;

            // Behind
            case 5:
                [x, z] = [-x, -z];
                break;
        }

        switch (rot)
        {
            // Rotate 0
            case 0:
                // No change
                break;

            // Rotate 90
            case 1:
                [x, y] = [-y, x];
                break;

            // Rotate 180
            case 2:
                [x, y] = [-x, -y];
                break;

            case 3:
                [x, y] = [y, -x];
                break;
        }

        return new Vector(x, y, z);
    }

    key(): string
    {
        return `${this.x},${this.y},${this.z}`;
    }

    manhattan(): number
    {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
}

console.log("Day 19");

const data = readFileSync("./data/day19.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);

const unknownScanners: Vector[][] = [];
for (let line of lines)
{
    const match = line.match(/^(-?\d+),(-?\d+),(-?\d+)$/);
    if(match)
    {
        unknownScanners[unknownScanners.length-1].push(new Vector(parseInt(match[1]), parseInt(match[2]), parseInt(match[3])));
    }   
    else
    {
        unknownScanners.push([]);
    }
}

const knownBeacons = unknownScanners.shift();
const scanners = [new Vector(0, 0, 0)];

while(unknownScanners.length)
{
    loop: for(let unknownScanner of unknownScanners)
    for(let r=0; r < 24; ++r)
    {
        const diffs = {};
        const rotatedBeacons = unknownScanner.map(v => v.rotate(r));
        
        for (let knownBeacon of knownBeacons)
        for (let rotatedBeacon of rotatedBeacons)
        {
            let diff = knownBeacon.sub(rotatedBeacon);
            let key = diff.key();
            diffs[key] = (diffs[key] || 0) + 1;

            if (diffs[key] >= 12)
            {
                scanners.push(diff);
                knownBeacons.push(...rotatedBeacons.map(b => b.add(diff)));
                unknownScanners.splice(unknownScanners.indexOf(unknownScanner), 1);
                continue loop;
            }
        }
    }
}

const uniqueBeacons = new Set();
knownBeacons.forEach(b => uniqueBeacons.add(b.key()));

console.log(uniqueBeacons.size);
console.log(Math.max(...scanners.flatMap((v, i) => scanners.slice(i+1).map( w => w.sub(v).manhattan()))));