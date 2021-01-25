const enterReadMessage = require("./endEnterReadMessage");

function enterReadWithDate(messageContent) {
    const messArr = messageContent.split("..");
    const dateStr = messArr.splice(0, 2)[1];
    const date = new Date(dateStr);
    let reply = processReadMessage(messArr.join(".."), date);
    let recordMessages = false;
    return {
        reply,
        recordMessages
    }
}

module.exports = enterReadWithDate;