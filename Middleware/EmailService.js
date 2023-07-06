const nodemailer = require("nodemailer");

const smtpClient = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "pestocb@gmail.com",
        pass: "znfamamqxpnzcabi"
    }
});

module.exports = smtpClient;
