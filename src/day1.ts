import { readFileSync } from 'fs';

function sumWindow(measurements: Array<number>, index: number, window: number) : number
{
	let sum = 0;

	for (let i=0; i < window; ++i)
	{
		sum += measurements[index + i];
	}

	return sum;
}

function countIncrementingMeasurements(measurements: Array<number>, window: number) : number
{
	if (measurements === undefined || measurements.length <= window)
	{
		return 0;
	}

	let count = 0;
	let previousMeasurement = sumWindow(measurements, 0, window);

	for (let i=1; i <= measurements.length - window; ++i)
	{
		const measurement = sumWindow(measurements, i, window);

		if (measurement > previousMeasurement)
		{
			count++;
		}

		previousMeasurement = measurement;
	}

	return count;
}

{
	const data = readFileSync('./data/day1a.dat', 'utf-8');
	const measurements = data.split(/[\r\n]+/).map(value => parseInt(value, 10));
	const incrementingMeasurements = countIncrementingMeasurements(measurements, 1);
	
	console.log("Part A: %d Incrementing Measurements - Window size 1", incrementingMeasurements);
}

{
	const data = readFileSync('./data/day1b.dat', 'utf-8');
	const measurements = data.split(/[\r\n]+/).map(value => parseInt(value, 10));
	const incrementingMeasurements = countIncrementingMeasurements(measurements, 3);

	console.log("Part B: %d Incrementing Measurements - Window size 3", incrementingMeasurements);
}
