const fs = require("fs");
const ExcelJS = require("exceljs")

function getTotals(entries) {
    const openings = entries.filter(ent => ent.type == "o");
    const annuals = entries.filter(ent => ent.type == "a");
    const quarterlys = entries.filter(ent => ent.type == "q");
    const monthlys = entries.filter(ent => ent.type == "m");
    const specials = entries.filter(ent => ent.type == "s");

    const totals = {
        quarterlyReads: sumEntries(quarterlys),
        monthlyReads: sumEntries(monthlys),
        annualReads: sumEntries(annuals),
        specialReads: sumEntries(specials), 
        openingReads: sumEntries(openings),
    };

    return totals
}

function sumEntries(entries) {
    let attempts = entries.reduce((total, entry) => total + entry.attempts, 0)
    let complete = entries.reduce((total, entry) => total + entry.complete, 0)

    return [attempts, complete, attempts - complete];
}


function readCSV(fileName) {
    return fs.readFileSync("/home/cush/projects/workRouteSheet/reads.csv", "utf8").split("\n")
}

function getEntriesWithinWeek(entries, date = new Date()) {
    const WEEKLENGTH = 604800*1000
    const endWeek = date.getTime();
    const startWeek = new Date(endWeek - WEEKLENGTH).getTime();
    const weekReads = entries.filter(entry => entry.timeStamp <= endWeek && entry.timeStamp >= startWeek)
    return weekReads;
}


class readEntry {
    constructor(entryString) {
        let entryArr = entryString.split(",")
        this.timeStamp = entryArr[0];
        this.type = entryArr[1];
        this.name = entryArr[2];
        this.attempts = +entryArr[3];
        this.complete = +entryArr[4];
        this.setFails();
        this.postcodes = entryArr.slice(5);
    }

    setFails() {
        this.fails =  this.attempts - this.complete;
    }

    getFails() {
        console.log(this.attempts, this.complete)
        return this.attempts - this.complete
    }
}


function addTotalsToSheet(weeksTotals, sheet) {
    const totalStartCol = 6
    let totalRowNum = 7;

    Object.values(weeksTotals).forEach(total => {
        let currentCol = totalStartCol;
        const row = sheet.getRow(totalRowNum)
        total.forEach(value => {
            row.getCell(currentCol).value = value;
            currentCol++;
        })
        totalRowNum++;
    })
}

async function createRouteSheet() {
    // open and load template
    const templateFile = "/home/cush/projects/workRouteSheet/createWorkRouteSheet/template.xlsx";
    const templateBook = new ExcelJS.Workbook();
    await templateBook.xlsx.readFile(templateFile);
    
    // get worksheet
    const sheet = templateBook.worksheets[0];

    // process csv file for info
    let csvEntries = readCSV();
    const entries = csvEntries.filter(line => line != "").map(line => new readEntry(line));
    const weekEntries = getEntriesWithinWeek(entries);
    const weeksTotals = getTotals(weekEntries);

    // Add totals then entries to file (totals first because rows won't be consistant week to week)
    addTotalsToSheet(weeksTotals, sheet)

    // get fileName
    const date = new Date();
    const fileName = `Routesheet-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.xlsx` 

    // save new file
    const newBook = templateBook;
    await newBook.xlsx.writeFile(fileName);
}

createRouteSheet();