import { readFileSync } from 'fs';

function parseDataFile(filename: string) : Array<number>
{
	const data = readFileSync(filename, 'utf-8');
	return data.split(/[\r\n]+/).map(value => parseInt(value, 10));
}

function countIncrementingMeasurements(measurements: Array<number>, window: number) : number
{
	if (measurements === undefined || measurements.length <= window)
	{
		return 0;
	}

	let count = 0;

	for (let i=window; i <= measurements.length; ++i)
	{
		if (measurements[i] > measurements[i-window])
		{
			count++;
		}
	}

	return count;
}

console.log("Day 1");
{
	const measurements = parseDataFile('./data/day1a.dat');
	const incrementingMeasurements = countIncrementingMeasurements(measurements, 1);
	
	console.log("Part A: %d Incrementing Measurements - Window size 1", incrementingMeasurements);
}

{
	const measurements = parseDataFile('./data/day1b.dat');
	const incrementingMeasurements = countIncrementingMeasurements(measurements, 3);

	console.log("Part B: %d Incrementing Measurements - Window size 3", incrementingMeasurements);
}
