const smtpClient = require('../Middleware/EmailService');
const sql = require("../DB/PostgresSql");
require('dotenv').config();

// USED FOR EXPORTING THE FUNCTIONS BELOW
const Mailer = {};

//SEND OTP MAIL
Mailer.sendForgotPassOtp = async (name, email) => {
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
                
                <p>We have received a request to reset your password for your Car Bazaar account. To proceed with the password reset, please enter the following One-Time Password (OTP) within the next 15 minutes:</p>
                
                <p><strong>OTP: ${otp}</strong></p>
                
                <p>If you did not initiate this password reset request, please ignore this email. Your account will remain secure.</p>
                
                <p>Please note that the OTP is confidential and should not be shared with anyone. For security reasons, it is recommended to avoid sharing your OTP through email or any other communication channel.</p>
                
                <p>If you have any questions or need further assistance, please don't hesitate to contact our support team at pestocb@gmail.com.</p>
                
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

Mailer.sendUserVerificationOtp = async (name, email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
        let query = sql`
            INSERT INTO user_verification (email, otp)
                VALUES (${email}, ${otp.toString()})
                ON CONFLICT (email) DO UPDATE
                    SET otp = EXCLUDED.otp;`;
        await query;
    } catch (error) {
        console.error('Error while generating otp:', error);
        return false;
    }
    const mailBody = `
        <html>
            <body>
                <p>Dear ${name},</p>

                <p>Thank you for registering with Car Bazaar. To complete your registration, please enter the following One-Time Password (OTP) within the next 15 minutes:</p>

                <p><strong>OTP: ${otp}</strong></p>

                <p>If you did not initiate this registration, please ignore this email. Your account will not be activated.</p>

                <p>Please note that the OTP is confidential and should not be shared with anyone. For security reasons, it is recommended to avoid sharing your OTP through email or any other communication channel.</p>

                <p>If you have any questions or need further assistance, please don't hesitate to contact our support team at pestocb@gmail.com.</p>

                <p>Welcome aboard Car Bazaar!</p>

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
                subject: "Car Bazaar | User Verification",
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

Mailer.verifyUserVerificationOtp = async (email, otp) => {
    try {
        const validOtp = (await sql`
        SELECT otp FROM user_verification
            WHERE email = ${email}`)[0];
        if (otp == validOtp.otp) {
            await sql`
            DELETE FROM user_verification
            WHERE email = ${email}`;
            return true;
        }
        else return false;
    } catch (error) {
        console.error('Error while generating otp:', error);
        return false;
    }
}

module.exports = Mailer;