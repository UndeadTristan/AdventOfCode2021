import { readFileSync } from 'fs';

console.log("Day 15");

const data = readFileSync("./data/day15.dat", 'utf-8');
const lines = data.split(/[\r\n]+/);

let map = [];
const tileSize = { x: lines[0].length, y: lines.length };
const mapSize = { x: tileSize.x * 5, y: tileSize.y * 5 };

class Node {
	x: number;
	y: number;
	value: number;
	f: number = 0;
	parent: Node = null;

	constructor(x: number, y: number, value: number) {
		this.x = x;
		this.y = y;
		this.value = value;
	}

	connections(): Array<Node> {
		const connections = [];

		if (this.x > 0) {
			connections.push(map[mapSize.x * this.y + this.x - 1]);
		}
		if (this.x < mapSize.x - 1) {
			connections.push(map[mapSize.x * this.y + this.x + 1]);
		}
		if (this.y > 0) {
			connections.push(map[mapSize.x * (this.y - 1) + this.x]);
		}
		if (this.y < mapSize.y - 1) {
			connections.push(map[mapSize.x * (this.y + 1) + this.x]);
		}

		return connections;
	}
}

let mapValues = [];
lines.forEach(line => mapValues = mapValues.concat(line.split('').map(n => parseInt(n, 10))));

for (let y=0; y < mapSize.y; ++y)
for (let x=0; x < mapSize.x; ++x)
{
	const tileX = x % tileSize.x;
	const tileY = y % tileSize.y;
	const riskX = Math.floor(x / tileSize.x);
	const riskY = Math.floor(y / tileSize.y);
	let value = mapValues[tileSize.x * tileY + tileX] + riskX + riskY;
	while (value > 9)
	{
		value -= 9;
	}
	map.push(new Node(x, y, value));
}

for (let y=0; y < mapSize.y; ++y)
{
	console.log(map.slice(mapSize.x * y, mapSize.x * (y + 1)).map(n => n.value).join(''));
}



function astar(startNode: Node, targetNode: Node): Array<Node> {
	const openNodes = [];
	const closedNodes = [startNode];

	let bestNode = startNode;

	while (bestNode != targetNode) {
		const connections = bestNode.connections();
		let openIndex: number;

		for (let nextNode of connections) {
			if (openNodes.indexOf(nextNode) == -1) {
				if (closedNodes.indexOf(nextNode) == -1) {
					nextNode.f = nextNode.value + bestNode.f;
					nextNode.parent = bestNode;
					openNodes.push(nextNode);
				}
			}
		}

		let lowF = Number.MAX_SAFE_INTEGER;

		//Loop through the open nodes around the starting target
		for (let i = 0; i < openNodes.length; ++i) {
			//if the node has already been visited, don't bother checking it
			if (closedNodes.indexOf(openNodes[i]) > -1) {
				continue;
			}
			//get the node within open list that has the lowest F value
			if (openNodes[i].f < lowF) {
				lowF = openNodes[i].f;
				bestNode = openNodes[i];
				openIndex = i;
			}
		}

		//lowest cost is chosen
		if (openNodes.length > 0) {
			closedNodes.push(bestNode);
			openNodes.splice(openIndex, 1);
		}
	}

	let path = [];
	let currentNode = targetNode;

	//retrieve the parents of each of the nodes, beginning with the final node to retrieve the shortest path
	while (currentNode != startNode) {
		path.push(currentNode);
		currentNode = currentNode.parent;
	}
	path.push(startNode);
	path = path.reverse();

	return path;
}

let path = astar(map[0], map[map.length - 1]);

console.log(path.map(n => `${n.value}`).join(' '));
console.log(path.slice(1, path.length).reduce((p, c) => p + c.value, 0));
