const nodemailer = require("nodemailer");
require("dotenv").config();
const zD = require("../helpers/zeroDate");

const fileName = `Routesheet_${zD.zeroDate(date.getDate())}-${zD.zeroDate(date.getMonth() + 1)}-${date.getFullYear()}.xlsx`;
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
            content: filePath
        },
    ]
}