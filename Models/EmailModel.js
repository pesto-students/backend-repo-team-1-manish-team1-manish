const smtpClient = require('../Middleware/EmailService');
const sql = require("../DB/PostgresSql");
require('dotenv').config();

// USED FOR EXPORTING THE FUNCTIONS BELOW
const Mailer = {};

//SEND OTP MAIL
Mailer.sendOtp = async (name, email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
        let query = sql`UPDATE users SET otp = ${otp} WHERE email = ${email}`;
        await query;
    } catch (error) {
        console.error('Error while generating otp:', error);
        return false;
    }
    const mailBody = `
        <html>
            <body>
                <p>Dear ${name},</p>
                
                <p>We have received a request to reset your password for your Car Bazaar account. To proceed with the password reset, please enter the following One-Time Password (OTP) within the next [time limit, e.g., 15 minutes]:</p>
                
                <p><strong>OTP: ${otp}</strong></p>
                
                <p>If you did not initiate this password reset request, please ignore this email. Your account will remain secure.</p>
                
                <p>Please note that the OTP is confidential and should not be shared with anyone. For security reasons, it is recommended to avoid sharing your OTP through email or any other communication channel.</p>
                
                <p>If you have any questions or need further assistance, please don't hesitate to contact our support team at [Company Support Email] or [Company Support Phone Number].</p>
                
                <p>Thank you for choosing Car Bazaar.</p>
                
                <p>Best regards,<br>The Car Bazaar Team</p>
            </body>
        </html>
    `;
    let mailInfo = null;
    try {
        mailInfo = await smtpClient.sendMail(
            {
                from: process.env.SENDER_MAIL,
                to: email,
                subject: "Car Bazaar | OTP to Renew Password",
                html: mailBody
            }
        );
    }
    catch (error) {
        console.log(error);
        return false;
    }
    return mailInfo ? true : false;
}

module.exports = Mailer;