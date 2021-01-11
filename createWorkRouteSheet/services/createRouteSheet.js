const ExcelJS = require("exceljs")

class RouteSheet {
    constructor(entries, templateName, fileName) {
        this.entries = entries;
        this.templateName = templateName;
        this.fileName = fileName;
    }

    getTotals() {
        const openings = this.entries.filter((ent) => ent.type == "o");
        const annuals = this.entries.filter((ent) => ent.type == "a");
        const quarterlys = this.entries.filter((ent) => ent.type == "q");
        const monthlys = this.entries.filter((ent) => ent.type == "m");
        const specials = this.entries.filter((ent) => ent.type == "s");

        const totals = {
            quarterlyReads: this.sumEntries(quarterlys),
            monthlyReads: this.sumEntries(monthlys),
            annualReads: this.sumEntries(annuals),
            specialReads: this.sumEntries(specials),
            openingReads: this.sumEntries(openings),
        };

        return totals;
    }

    sumEntries(entryArray) {
        let attempts = entryArray.reduce((total, entry) => total + entry.attempts, 0);
        let complete = entryArray.reduce((total, entry) => total + entry.complete, 0);
        return [attempts, complete, attempts - complete];
    }

    addTotalsToSheet(sheet) {
        const weekTotals = this.getTotals();
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
        let currentDate;
        let currentDay;
        this.entries.forEach((entry, i) => {
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