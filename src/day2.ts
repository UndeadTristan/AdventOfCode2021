import { assert } from 'console';
import { readFileSync } from 'fs';

enum Instuction {
	forward,
	up,
	down,
}

class Command {
	instruction: Instuction;
	units: number;

	constructor(instruction: Instuction, units: number) {
		this.instruction = instruction;
		this.units = units;
	}
}

class Submarine {
	position: number;
	depth: number;

	constructor() {
		this.position = 0;
		this.depth = 0;
	}

	// forward X increases the horizontal position by X units.
	// down X increases the depth by X units.
	// up X decreases the depth by X units.
	runCommand(command: Command) {
		switch (command.instruction) {
			case Instuction.forward:
				this.position += command.units;
				break;
			case Instuction.up:
				this.depth -= command.units;
				break;
			case Instuction.down:
				this.depth += command.units;
				break;
		}
	}

	print() {
		console.log("Submarine %s %d", JSON.stringify(this), this.position * this.depth);
	}
}

class SubmarineAimable extends Submarine {
	aim: number;

	constructor() {
		super();
		this.aim = 0;
	}

	// down X increases your aim by X units.
	// up X decreases your aim by X units.
	// forward X does two things:
	// It increases your horizontal position by X units.
	// It increases your depth by your aim multiplied by X.
	runCommand(command: Command) {
		switch (command.instruction) {
			case Instuction.forward:
				this.position += command.units;
				this.depth += command.units * this.aim;
				break;
			case Instuction.up:
				this.aim -= command.units;
				break;
			case Instuction.down:
				this.aim += command.units;
				break;
		}
	}
}

function parseDataToCommands(filepath: string): Array<Command> {
	const data = readFileSync(filepath, 'utf-8');
	return data.split(/[\r\n]+/).map(commandInput => {
		const match = commandInput.match(/^(\S+)\s(\d+)$/);
		assert(match && match.length == 3, `Invalid commmand input ${commandInput}`);

		const instruction = Instuction[match[1]];
		const units = parseInt(match[2], 10);

		return new Command(instruction, units);
	});
}

console.log("Day 2");
const commands = parseDataToCommands("./data/day2.dat");

{
	const submarine = new Submarine();
	commands.forEach(command => submarine.runCommand(command));
	submarine.print();
}

{
	const submarine = new SubmarineAimable();
	commands.forEach(command => submarine.runCommand(command));
	submarine.print();
}