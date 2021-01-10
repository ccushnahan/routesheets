const nodemailer = require("nodemailer");
require("dotenv").config();
const zeroDate = require("../helpers/zeroDate");
const path = require("path");
const os = require("os")

const date = new Date();
const fileName = `Routesheet_${zeroDate(date.getDate())}-${zeroDate(date.getMonth() + 1)}-${date.getFullYear()}.xlsx`;
const filePath = path.join(os.homedir(), "/completedRoutesheets/", fileName)

const transporter = nodemailer.createTransport({
    service:"outlook",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `Route Sheet ${(new Date()).toString().slice(4, 16)}`,
    text: "This week's route sheet",
    attachments: [
        {
            filename: fileName,
            path: filePath
        },
    ]
}

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Email sent: " + info.response);
    }
})