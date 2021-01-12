const fs = require("fs");
const path = require("path");
const os = require("os");
const ReadEntry = require("./ReadEntry");

class WeeksEntries {
    constructor(csvFileName = "reads.csv") {
        this.csvFileName = csvFileName;
        this.readEntries;
        this.setReadEntries(this.csvFileName)
        this.weeksEntries;
        this.setWeeksEntries();
    }

    readCSV(fileName) {
        const home = os.homedir()
        const csvPath = path.join(home, "/readsRecords/", fileName);
        return fs
            .readFileSync(csvPath, "utf8")
            .split("\n");
    }

    setReadEntries(fileName) {
        const csvEntries = this.readCSV(fileName);
        const readEntries = csvEntries
            .filter((line) => line != "")
            .map((line) => new ReadEntry(line));
        this.readEntries = readEntries;
    }

    setWeeksEntries(entries = this.readEntries, date = new Date()) {
        const WEEKLENGTH = 604800 * 1000;
        const endWeek = date.getTime();
        const startWeek = new Date(endWeek - WEEKLENGTH).getTime();
        const weekReadEntries = entries.filter(
            (entry) => entry.timeStamp <= endWeek && entry.timeStamp >= startWeek
        );
        this.weeksEntries = weekReadEntries;
    }

    getWeeksEntries() {
        return this.weeksEntries;
    }

    getReadEntries() {
        return this.readEntries;
    }
}

module.exports = WeeksEntries;