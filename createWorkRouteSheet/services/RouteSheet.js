const ExcelJS = require("exceljs");
const getFileName = require("../../helpers/getFileName");
const gfd = require("../../helpers/getFormattedDate");
const getTemplateFile = require("./getTemplateFile")
const WeeksEntries = require("./WeeksEntries");

class RouteSheet {
    constructor(templateName = getTemplateFile(), entries = new WeeksEntries(), fileName = getFileName()) {
        this.entries = entries;
        this.templateName = templateName;
        this.fileName = fileName;
    }

    sortWeeksEntries() {
        const week = {
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": [],
        };

        this.entries.getWeeksEntries().forEach(entry => week[entry.getDay()].push(entry));
        return week;
    }

    addTotalsToSheet(sheet) {
        const weekTotals = this.entries.getWeeksTotals();
        const totalStartCol = 6;
        let totalRowNum = 7;

        Object.values(weekTotals).forEach((total) => {
            let currentCol = totalStartCol;
            const row = sheet.getRow(totalRowNum);
            total.forEach((value) => {
                row.getCell(currentCol).value = value;
                currentCol++;
            });
            totalRowNum++;
        });
    }

    addReadsToSheet(sheet) {
        const sortedWeek = this.sortWeeksEntries()
        const readEntries = Object.entries(sortedWeek).map(day => {
            console.log(day);
            const dayName = day[0];
            const rowEntries = [];
            if (day[1].length == 0) {
                const weeksDates = this.entries.getWeeksDates();
                rowEntries.push([dayName, gfd(weeksDates[dayName])]);
            } else {
                day[1].forEach((entry, i) => {
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
                    if (i == 0) {
                        rowVals[0] = dayName;
                        rowVals[1] = entry.getDate();
                    }
                    rowEntries.push(rowVals);
                });
            }
            rowEntries.push([]);
            return rowEntries;
        }).flat().reverse();
        readEntries.forEach(row => sheet.insertRow(5, row, "i"));
    }

    async createRouteSheet() {

        const templateBook = new ExcelJS.Workbook();
        await templateBook.xlsx.readFile(this.templateName);

        const sheet = templateBook.worksheets[0];
        const file = this.fileName;

        this.addTotalsToSheet(sheet);
        this.addReadsToSheet(sheet);

        const newBook = templateBook;
        await newBook.xlsx.writeFile(file)
    }

}

module.exports = RouteSheet;