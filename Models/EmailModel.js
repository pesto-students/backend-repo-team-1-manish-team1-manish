const smtpClient = require('../Middleware/EmailService');
const sql = require("../DB/PostgresSql");
require('dotenv').config();

// USED FOR EXPORTING THE FUNCTIONS BELOW
const Mailer = {};

//SEND OTP MAIL
Mailer.sendOtp = async (name, email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
        let query = sql`UPDATE users SET otp = ${otp}`;
        query.append(sql` WHERE email = ${email}`);
        await query;
    } catch (error) {
        console.error('Error updating user:', error);
        return { status: false, info: error };;
    }
    const mailBody = `
        Dear ${name},

        We have received a request to reset your password for your Car Bazaar account. To proceed with the password reset, please enter the following One-Time Password (OTP) within the next [time limit, e.g., 15 minutes]:

        OTP: ${otp}

        If you did not initiate this password reset request, please ignore this email. Your account will remain secure.

        Please note that the OTP is confidential and should not be shared with anyone. For security reasons, it is recommended to avoid sharing your OTP through email or any other communication channel.

        If you have any questions or need further assistance, please don't hesitate to contact our support team at [Company Support Email] or [Company Support Phone Number].

        Thank you for choosing Car Bazaar.

        Best regards,
        The Car Bazaar Team
        `
    smtpClient.sendMail(
        {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Car Bazaar | OTP to Renew Password",
            text: mailBody
        },
        (err, info) => {
            if (err) {
                return { status: false, info: err };
            }
            console.log(info.envelope);
            console.log(info.messageId);
            return { status: true, info }
        }
    );
}

module.exports = Mailer;