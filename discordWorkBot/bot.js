require("dotenv").config();
const os = require("os")
const path = require("path")
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();


const home = os.homedir();
let recordMessages = false;

client.once("ready", () => console.log("ready"));

client.login(process.env.TOKEN)

client.on("message", message => {
    if (message.author.username != "workbot") {
        let messageContent = message.content.toUpperCase();
        let reply = "";
        if (!recordMessages) {
            if (messageContent == "!START") {
                reply = "Enter reads (readtype..readname..attempts..complete..postcodes)"
                console.log("started");
                recordMessages = true;
            } 
        } else if (recordMessages) {
            if (messageContent == "!END") {
                reply = "Finished entering reads."
                console.log("ended")
                recordMessages = false;
            } else {
                const date = new Date();
                const sectCount = messageContent.match(/[.][.]/gi) || 0;
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
            }
        }
        if (reply.length > 0) {
            message.reply(reply)
        } 
    }
    console.log(message.content);
})
