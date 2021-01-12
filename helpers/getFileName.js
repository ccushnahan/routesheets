const os = require("os");
const path = require("path")
const zeroDate = require("./zeroDate")

module.exports = function getFileName() {
    const date = new Date()
    const fileName = `Routesheet_${zeroDate(date.getDate())}-${zeroDate(date.getMonth() + 1)}-${date.getFullYear()}.xlsx`;
    const filePath = path.join(os.homedir(), "/completedRoutesheets/", fileName)
    return filePath;
}