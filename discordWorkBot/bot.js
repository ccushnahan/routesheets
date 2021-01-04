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
    let messageContent = message.content.toUpperCase()
    if (!recordMessages) {
        if (messageContent == "!START") {
            message.reply("Enter reads (readtype..readname..attempts..complete..postcodes)")
            console.log("started");
            recordMessages = true;
        } 
    } else if (recordMessages) {
        if (message.content == "!END") {
            message.reply("Finished entering reads.")
            console.log("ended")
            recordMessages = false;
        } else {
            const date = new Date();
            const sectCount = messageContent.match(/[.][.]/gi) || 0;
            if (sectCount < 4) {
                message.reply(`You submitted: ${messageContent}`)
                message.reply(`This doesn't seem to be in the correct format`)
                message.reply(`Please enter this again (readtype..readname..attempts..complete..postcodes)`)
            } else {
                const csvEntry = date.getTime() + "," + messageContent.split("..").join(",") + "\n";
                console.log(csvEntry)
                message.reply(`Read entered: ${messageContent}`)
                fs.appendFile(`${path.join(home, "/readsRecords/reads.csv")}`, csvEntry, (err) => {
                    console.log(err);
                    message.reply(`Something went wrong: ${err.message}`)
                    message.reply("Try again")
                })
            }
        }
    }
    console.log(message.content);
})
