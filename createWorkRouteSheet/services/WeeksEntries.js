const fs = require("fs");
const path = require("path");
const os = require("os");
const ReadEntry = require("./ReadEntry");
const {
    start
} = require("repl");

class WeeksEntries {
    constructor(csvFileName = "reads.csv", weeksEnd = new Date()) {
        this.csvFileName = csvFileName;
        this.readEntries;
        this.weeksEnd = weeksEnd;
        this.startWeek;
        this.setWeeksStart();
        this.setReadEntries(this.csvFileName);
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

    setWeeksStart() {
        const currentDay = this.weeksEnd.getDay();
        if (currentDay == 0) currentDay = 7;
        const WEEKLENGTH = currentDay * 24 * 60 * 60 * 1000;
        const startWeek = new Date(this.weeksEnd - WEEKLENGTH).getTime();
        this.startWeek = startWeek;
    }

    setWeeksEntries(entries = this.readEntries, date = new Date()) {
        const weekReadEntries = entries.filter(
            (entry) => entry.timeStamp <= this.weeksEnd && entry.timeStamp >= this.startWeek
        );
        this.weeksEntries = weekReadEntries;
    }

    getWeeksEntries() {
        return this.weeksEntries;
    }

    getReadEntries() {
        return this.readEntries;
    }


    sumEntries(entryArray) {
        let attempts = entryArray.reduce((total, entry) => total + entry.attempts, 0);
        let complete = entryArray.reduce((total, entry) => total + entry.complete, 0);
        return [attempts, complete, attempts - complete];
    }

    getWeeksTotals() {
        const openings = this.weeksEntries.filter((ent) => ent.type == "o");
        const annuals = this.weeksEntries.filter((ent) => ent.type == "a");
        const quarterlys = this.weeksEntries.filter((ent) => ent.type == "q");
        const monthlys = this.weeksEntries.filter((ent) => ent.type == "m");
        const specials = this.weeksEntries.filter((ent) => ent.type == "s");

        const totals = {
            quarterlyReads: this.sumEntries(quarterlys),
            monthlyReads: this.sumEntries(monthlys),
            annualReads: this.sumEntries(annuals),
            specialReads: this.sumEntries(specials),
            openingReads: this.sumEntries(openings),
        };

        return totals;
    }

    getWeeksDates() {
        const DAYLENGTH = 24 * 60 * 60 * 1000;
        const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const weekDates = {};
        weekDays.forEach((day, i) => weekDates[day] = new Date(this.startWeek + (DAYLENGTH * i + 1)));
        return weekDates;
    }
}

module.exports = WeeksEntries;