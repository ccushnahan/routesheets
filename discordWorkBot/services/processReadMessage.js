// if message is !read
const fs = require("fs");
const path = require("path");
const os = require("os");


function processReadMessage(messageContent, date = new Date()) {
    const home = os.homedir();
    const sectCount = messageContent.match(/[.][.]/gi) || 0;
    let reply;
    if (sectCount < 4) {
        reply = `You submitted: ${messageContent}\n`
        reply += `This doesn't seem to be in the correct format\n`
        reply += `Please enter this again (readtype..readname..attempts..complete..postcodes)`
    } else {
        const csvEntry = date.getTime() + "," + messageContent.split("..").join(",") + "\n";
        console.log(csvEntry)
        reply = `Read entered: ${csvEntry}`;
        fs.appendFile(`${path.join(home, "/readsRecords/reads.csv")}`, csvEntry, (err) => {
            console.log(err);
            reply += `\nSomething went wrong: ${err}\nTry again`
        })
    }

    return reply;
}

module.exports = processReadMessage;