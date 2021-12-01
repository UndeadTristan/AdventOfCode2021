"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
function parseDataFile(filename) {
    var data = (0, fs_1.readFileSync)(filename, 'utf-8');
    return data.split(/[\r\n]+/).map(function (value) { return parseInt(value, 10); });
}
function countIncrementingMeasurements(measurements, window) {
    if (measurements === undefined || measurements.length <= window) {
        return 0;
    }
    var count = 0;
    for (var i = window; i <= measurements.length; ++i) {
        if (measurements[i] > measurements[i - window]) {
            count++;
        }
    }
    return count;
}
console.log("Day 1");
{
    var measurements = parseDataFile('./data/day1a.dat');
    var incrementingMeasurements = countIncrementingMeasurements(measurements, 1);
    console.log("Part A: %d Incrementing Measurements - Window size 1", incrementingMeasurements);
}
{
    var measurements = parseDataFile('./data/day1b.dat');
    var incrementingMeasurements = countIncrementingMeasurements(measurements, 3);
    console.log("Part B: %d Incrementing Measurements - Window size 3", incrementingMeasurements);
}
//# sourceMappingURL=day1.js.map