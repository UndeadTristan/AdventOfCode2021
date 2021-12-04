import { readFileSync } from 'fs';

function parseData(filepath: string): Array<number> {
	const data = readFileSync(filepath, 'utf-8');
	return data.split(/[\r\n]+/).map(binaryStr => {
		return parseInt(binaryStr, 2);
	});
}

function numSetBitsAtPosition(data: Array<number>, bitPosition: number): number {
	return data.reduce((p, c) => p + (c >> bitPosition & 1), 0);
}

function calculateRate(data: Array<number>, numBits: number): number {
	let rate = 0;

	for (let bitPosition = 0; bitPosition < numBits; ++bitPosition) {
		if (numSetBitsAtPosition(data, bitPosition) > data.length / 2) {
			rate |= 1 << bitPosition;
		}
	}

	return rate;
}

function findRateUsingFilter(data: Array<number>, numBits: number, useMostCommon: boolean): number {
	let result = [...data];

	for (let bitPosition = numBits - 1; bitPosition >= 0; --bitPosition) {
		const numSetBits = numSetBitsAtPosition(result, bitPosition);
		const comparisonBit = useMostCommon ? numSetBits >= result.length / 2 ? 1:0 : numSetBits < result.length / 2 ? 1:0;
		result = result.filter(v => (v >> bitPosition & 1) == comparisonBit);
		if (result.length == 1) {
			return result[0];
		}
	}

	throw 'Could not find rate using filter';
}



function flipBits(bits: number, numBits: number): number {
	let mask = 1;

	for (let i = 1; i < numBits; ++i) {
		mask |= mask << 1;
	}

	return ~bits & mask;
}

// const data = parseData("./data/day3.sample.dat");
// const numBits = 5;
const data = parseData("./data/day3.dat");
const numBits = 12;

const gammaRate = calculateRate(data, numBits);
const epsilonRate = flipBits(gammaRate, numBits);
const oxygenGeneratorRating = findRateUsingFilter(data, numBits, true);
const co2ScrubberRating = findRateUsingFilter(data, numBits, false);

console.log("Day 3");
console.log("Gamma Rate: " + gammaRate.toString(2).padStart(numBits, '0'));
console.log("Epsilon Rate: " + epsilonRate.toString(2).padStart(numBits, '0'));
console.log("Power consumption: " + gammaRate * epsilonRate);
console.log("Oxygen Generator Rating: " + oxygenGeneratorRating.toString(2).padStart(numBits, '0'));
console.log("CO2 Scrubber Rating: " + co2ScrubberRating.toString(2).padStart(numBits, '0'));
console.log("life support rating: " + oxygenGeneratorRating * co2ScrubberRating);
