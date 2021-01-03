require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();

let recordMessages = false;

client.once("ready", () => console.log("ready"));

client.login(process.env.TOKEN)

client.on("message", message => {
    if (!recordMessages) {
        if (message.content == "!start") {
            console.log("started");
            recordMessages = true;
        } 
    } else if (recordMessages) {
        if (message.content == "!end") {
            console.log("ended")
            recordMessages = false;
        } else {
            const date = new Date();
            const messageStr = message.content
            const sectCount = messageStr.match(/[.][.]/gi) || 0;
            if (sectCount < 4) {
                // validation
            } else {
                const csvEntry = date.getTime() + "," + messageStr.split("..").join(",") + "\n";
                console.log(csvEntry)
                fs.appendFile("~/readsRecords/reads.csv", csvEntry, (err) => {
                    console.log(err);
                })
            }
        }
    }
    console.log(message.content);
})
