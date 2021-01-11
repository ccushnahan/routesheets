const fs = require("fs");
const ExcelJS = require("exceljs");
const path = require("path");
const os = require("os");
const zeroDate = require("../helpers/zeroDate");
const RouteSheet = require("./services/createRouteSheet")

function getTotals(entries) {
  const openings = entries.filter((ent) => ent.type == "o");
  const annuals = entries.filter((ent) => ent.type == "a");
  const quarterlys = entries.filter((ent) => ent.type == "q");
  const monthlys = entries.filter((ent) => ent.type == "m");
  const specials = entries.filter((ent) => ent.type == "s");

  const totals = {
    quarterlyReads: sumEntries(quarterlys),
    monthlyReads: sumEntries(monthlys),
    annualReads: sumEntries(annuals),
    specialReads: sumEntries(specials),
    openingReads: sumEntries(openings),
  };

  return totals;
}

function sumEntries(entries) {
  let attempts = entries.reduce((total, entry) => total + entry.attempts, 0);
  let complete = entries.reduce((total, entry) => total + entry.complete, 0);

  return [attempts, complete, attempts - complete];
}

function readCSV(fileName) {
  const home = os.homedir()
  const csvPath = path.join(home, "/readsRecords/reads.csv");
  return fs
    .readFileSync(csvPath, "utf8")
    .split("\n");
}

function getEntriesWithinWeek(entries, date = new Date()) {
  const WEEKLENGTH = 604800 * 1000;
  const endWeek = date.getTime();
  const startWeek = new Date(endWeek - WEEKLENGTH).getTime();
  const weekReads = entries.filter(
    (entry) => entry.timeStamp <= endWeek && entry.timeStamp >= startWeek
  );
  return weekReads;
}

class readEntry {
  constructor(entryString) {
    let entryArr = entryString.split(",");
    this.timeStamp = entryArr[0];
    this.type = entryArr[1].toLowerCase();
    this.name = entryArr[2];
    this.attempts = +entryArr[3];
    this.complete = +entryArr[4];
    this.setFails();
    this.postcodes = entryArr.slice(5).join("").toUpperCase();
  }

  getDate() {
    const date = new Date(+this.timeStamp)
    return `${zeroDate(date.getDate())}-${zeroDate(date.getMonth() + 1)}-${date.getFullYear()}`;
  }

  getDay() {
    const date = new Date(+this.timeStamp)
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  }

  setFails() {
    this.fails = this.attempts - this.complete;
  }

  getFails() {
    console.log(this.attempts, this.complete);
    return this.attempts - this.complete;
  }
}

function addTotalsToSheet(weeksTotals, sheet) {
  const totalStartCol = 6;
  let totalRowNum = 7;

  Object.values(weeksTotals).forEach((total) => {
    let currentCol = totalStartCol;
    const row = sheet.getRow(totalRowNum);
    total.forEach((value) => {
      row.getCell(currentCol).value = value;
      currentCol++;
    });
    totalRowNum++;
  });
}

function addReadsToSheet(weekEntries, sheet) {
  let currentDate;
  let currentDay;
  weekEntries.forEach((entry, i) => {
    let currentRow = 5 + i;
    let rowVals = [
      "",
      "",
      entry.postcodes,
      "",
      entry.name,
      entry.attempts,
      entry.complete,
      entry.fails,
    ];
    if (entry.getDay() != currentDay) {
      currentDate = entry.getDate();
      currentDay = entry.getDay();
      rowVals[0] = currentDay;
      rowVals[1] = currentDate;
    }
    console.log(rowVals)
    sheet.spliceRows(currentRow, 0, rowVals);
  });
}



async function createRouteSheet() {
  // open and load template
  const templateFile =
    path.join(os.homedir(), "projects/routesheets/createWorkRouteSheet/template.xlsx");
  const templateBook = new ExcelJS.Workbook();
  await templateBook.xlsx.readFile(templateFile);

  // get worksheet
  const sheet = templateBook.worksheets[0];

  // process csv file for info
  let csvEntries = readCSV();
  const entries = csvEntries
    .filter((line) => line != "")
    .map((line) => new readEntry(line));
  const weekEntries = getEntriesWithinWeek(entries);
  const weeksTotals = getTotals(weekEntries);

  // Add totals then entries to file (totals first because rows won't be consistant week to week)
  addTotalsToSheet(weeksTotals, sheet);
  addReadsToSheet(weekEntries, sheet);

  // get fileName
  const date = new Date();
  const fileName = `Routesheet_${zeroDate(date.getDate())}-${zeroDate(date.getMonth() + 1)}-${date.getFullYear()}.xlsx`;
  const filePath = path.join(os.homedir(), "/completedRoutesheets/", fileName)

  // save new file
  const newBook = templateBook;
  await newBook.xlsx.writeFile(filePath);
}

// createRouteSheet();

const date = new Date();
const fileName = `Routesheet_${zeroDate(date.getDate())}-${zeroDate(date.getMonth() + 1)}-${date.getFullYear()}.xlsx`;
const filePath = path.join(os.homedir(), "/completedRoutesheets/", fileName)
const templateFile =
  path.join(os.homedir(), "projects/routesheets/createWorkRouteSheet/template.xlsx");
let csvEntries = readCSV();
const entries = csvEntries
  .filter((line) => line != "")
  .map((line) => new readEntry(line));
const weekEntries = getEntriesWithinWeek(entries);

const routesheet = new RouteSheet(weekEntries, templateFile, filePath);
routesheet.createRouteSheet();