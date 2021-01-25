function getMessageCommand(messageContent) {
    if ((/^[!]\w+/).test(messageContent)) {
        const messageCommand = messageContent.match(/[!]\w+/);
        return messageCommand[0];
    } else {
        return null;
    }
}

module.exports = getMessageCommand;