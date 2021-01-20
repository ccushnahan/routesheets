const enterReadMessage = require("./endEnterReadMessage");

function enterReadWithDate(messageContent) {
    const messArr = messageContent.split("..");
    const dateStr = messArr.splice(0, 2)[1];
    const date = new Date(dateStr);
    return enterReadMessage(messArr.join(".."), date);
}

module.exports = enterReadWithDate;