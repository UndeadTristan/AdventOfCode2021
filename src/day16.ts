import { assert } from 'console';
import { readFileSync } from 'fs';

class PacketReader {
    binaryData: string;
    bitsRead: number = 0;
    versionTotal: number = 0;
    tabs: number = 0;

    constructor(packetData: string) {
        this.binaryData = packetData.split('').map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('');
    }

    read(bitsToRead: number): number {
        assert(this.bitsRead + bitsToRead <= this.binaryData.length);
        this.bitsRead += bitsToRead;
        const bits = this.binaryData.substring(this.bitsRead - bitsToRead, this.bitsRead);
        return parseInt(bits, 2);
    }

    readLiteral(): bigint {
        let literal = BigInt(0);
        let continueBit: number;

        do {
            continueBit = this.read(1);
            literal = (literal << BigInt(4)) | BigInt(this.read(4));
        }
        while (continueBit);

        return literal;
    }

    readPacket(): BigInt {
        const v = this.read(3);
        const t = this.read(3);

        this.versionTotal += v;

        if (t == 4) {
            return this.readLiteral();
        }

        const values: Array<BigInt> = [];
        const i = this.read(1)
        if (i) {
            let l = this.read(11);
            while (l--) {
                values.push(this.readPacket());
            }
        }
        else {
            const l = this.read(15);
            const startBitsRead = this.bitsRead;
            while (this.bitsRead - startBitsRead < l) {
                values.push(this.readPacket());
            }
        }

        switch (t) {
            // 0 Sum
            case 0:
                //return values.reduce((p, c) => p + c);

            // 1 Product
            case 1:
                //return values.reduce((p, c) => p * c);

            // 2 Min
            case 2:
                return values.reduce((m, e) => e < m ? e : m);

            // 3 Max
            case 3:
                return values.reduce((m, e) => e > m ? e : m);

            // 5 Greater Than
            case 5:
                return values[0] > values[1] ? BigInt(1) : BigInt(0);

            // 6 Less Than
            case 6:
                return values[0] < values[1] ? BigInt(1) : BigInt(0);

            // 7 Equal To
            case 7:
                return values[0] === values[1] ? BigInt(1) : BigInt(0);
        }
    }
}

console.log("Day 16");

const data = readFileSync("./data/day16.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);
for (let line of lines) {
    let reader = new PacketReader(line);
    const result = reader.readPacket();

    console.log(`VersionTotal: ${reader.versionTotal}`);
    console.log(`Result: ${result}`);
}
