const processReadMessage = require("./processReadMessage");

function enterReadMessage(messageContent) {
    let reply = processReadMessage(messageContent);
    let recordMessages = false;
    return {
        reply,
        recordMessages
    }
}