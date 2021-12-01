"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
function sumWindow(measurements, index, window) {
    var sum = 0;
    for (var i = 0; i < window; ++i) {
        sum += measurements[index + i];
    }
    return sum;
}
function countIncrementingMeasurements(measurements, window) {
    if (measurements === undefined || measurements.length <= window) {
        return 0;
    }
    var count = 0;
    var previousMeasurement = sumWindow(measurements, 0, window);
    for (var i = 1; i <= measurements.length - window; ++i) {
        var measurement = sumWindow(measurements, i, window);
        if (measurement > previousMeasurement) {
            count++;
        }
        previousMeasurement = measurement;
    }
    return count;
}
{
    var data = (0, fs_1.readFileSync)('./data/day1a.dat', 'utf-8');
    var measurements = data.split(/[\r\n]+/).map(function (value) { return parseInt(value, 10); });
    var incrementingMeasurements = countIncrementingMeasurements(measurements, 1);
    console.log("Part A: %d Incrementing Measurements - Window size 1", incrementingMeasurements);
}
{
    var data = (0, fs_1.readFileSync)('./data/day1b.dat', 'utf-8');
    var measurements = data.split(/[\r\n]+/).map(function (value) { return parseInt(value, 10); });
    var incrementingMeasurements = countIncrementingMeasurements(measurements, 3);
    console.log("Part B: %d Incrementing Measurements - Window size 3", incrementingMeasurements);
}
//# sourceMappingURL=day1.js.map