module.exports = function zeroDate(num) {
    return `${num}`.length == 1 ? "0" + num : num;
}