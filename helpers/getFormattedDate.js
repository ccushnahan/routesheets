const zeroDate = require("./zeroDate");

module.exports = function getFormattedDate(date) {
    return `${zeroDate(date.getDate())}-${zeroDate(date.getMonth() + 1)}-${date.getFullYear()}`;
}