const zeroDate = require("../../helpers/zeroDate")

class ReadEntry {
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

module.exports = ReadEntry;