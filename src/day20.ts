import { assert } from 'console';
import { readFileSync } from 'fs';

class Image
{
    size: {w: number, h: number};
    image: string[];
    step = 0;

    print(padding: number)
    {
        console.log('');
        let count = 0;
        for (let y=-padding; y < this.size.h+padding; ++y)
        {
            let line = "";
            for (let x=-padding; x < this.size.w+padding; ++x)
            {
                const pixel = this.readPixel(x, y);
                line += pixel;
                if (pixel == '#') count++;
            }
            console.log(line);
        }
        console.log(count);
    }

    readPixel(x: number, y: number): string
    {
        // The small input image you have is only a small region of the actual infinite input image; the rest of the input image consists of dark pixels (.)
        if (x < 0 || x >= this.size.w ||
            y < 0 || y >= this.size.h)
        {
            return this.step % 2 ? iea[0] : iea[iea.length-1];
        }
        else
        {
            return this.image[this.size.w * y + x];
        }
    }

    readIndex(x: number, y: number)
    {
        let binaryStr = "";
        for (let yy=y-1; yy <= y+1; ++yy)
        for (let xx=x-1; xx <= x+1; ++xx)
        {
            binaryStr += this.readPixel(xx, yy) === "#" ? "1" : "0";
        }
        return parseInt(binaryStr, 2);
    }

    enhance(iea: string): Image
    {
        const output = new Image();
        output.step = this.step+1;
        output.size = {w: this.size.w + 2, h: this.size.h + 2};
        output.image = new Array<string>(output.size.w * output.size.h);

        for (let y=0; y < output.size.h; ++y)
        for (let x=0; x < output.size.w; ++x)
        {
            const index = this.readIndex(x-1, y-1);
            output.image[output.size.w * y + x] = iea[index];
        }

        return output;
    }
}

console.log("Day 20");

const data = readFileSync("./data/day20.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);

// Image Enhancement Algorythm
const iea = lines.shift();

const padding = 2;
const enhancements = 50;

let image = new Image();
image.size = {w: lines[0].length, h: lines.length};
image.image = lines.join('').split('');

image.print(padding);

for (let i=0; i < enhancements; ++i)
{
    image = image.enhance(iea);
    image.print(padding);
}