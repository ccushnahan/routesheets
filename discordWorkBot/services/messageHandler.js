const getMessageCommand = require("./getMessageCommand");

function messageHandler(messageContent) {
    const messagesTypes = {

    };
    const messageCommand = getMessageCommand(messageContent);
    if (messageCommand) {
        return messagesTypes[messageCommand](messageContent) || "Invalid command: To get list of commands type '!help'";
    }
}

module.exports = messageHandler;


// function returnMessage(message) {
//     return message;
// }

// const commands = {
//     rM: returnMessage,
// }

// commands["rM"]("Hello World");