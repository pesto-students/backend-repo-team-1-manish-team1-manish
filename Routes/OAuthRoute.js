const express = require("express");
const router = express.Router();
const passport = require("passport");
const cookieParser = require("cookie-parser");
const Cookie = require("cookies");
const bodyParser = require("body-parser");
const authService = require("../Middleware/AuthService");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const Mailer = require("../Models/EmailModel");
require("../Middleware/Passport");

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Route to handle user registration
router.post("/register", async (req, res) => {
    const { name, firstName, lastName, email, phoneNo, password } = req.body;
    try {
        const user = (await User.getByEmail(email));
        if (user) {
            return res.status(409).send({ message: "User already exist! Please Login." });
        }
        const newUser = await User.create(name, firstName, lastName, email, phoneNo, password, 'self');
        jwt.sign(
            { id: newUser.id, name: newUser.name, email: newUser.email, first_name: newUser.first_name, last_name: newUser.last_name, auth_provider: newUser.auth_provider },
            process.env.CLIENT_SECRET,
            { expiresIn: '120 min' },
            (err, token) => {
                if (err) {
                    console.error("Error signing token:", err);
                    return res.status(500).send({ message: "Internal Server Error!" });
                } else {
                    // Set the token in the response as a cookie or in the response body as needed
                    // res.cookie('jwtoken', token, { httpOnly: true, secure: true, maxAge: (1000 * 60 * 60) });
                    const cookie = new Cookie(req, res, { secure: true });
                        cookie.set("jwtoken", token, {
                            secure: true,
                            httpOnly: true,
                            sameSite: "none",
                            maxAge: 1000 * 60 * 60,
                        });
                    return res.status(201).send(newUser);
                }
            }
        );
    } catch (error) {
        console.error("Error while registering user:", error);
        res.status(500).send({ message: "Error occurred while registering user" });
    }
});

// Route to handle user login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.getByEmail(email);

        if (!user) {
            return res.status(404).send({ message: "User does not exist!" });
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // If password validation is successful, generate the token using the signToken function
            jwt.sign(
                { id: user.id, name: user.name, email: user.email, first_name: user.first_name, last_name: user.last_name, auth_provider: user.auth_provider },
                process.env.CLIENT_SECRET,
                { expiresIn: '60 min' },
                (err, token) => {
                    if (err) {
                        console.error("Error signing token:", err);
                        return res.status(500).send({ message: "Internal Server Error!" });
                    } else {
                        // Set the token in the response as a cookie or in the response body as needed
                        // res.cookie('jwtoken', token, { httpOnly: true, sameSite: "none", secure: true });
                        res.cookie("jwtoken", token, {
                            expires: new Date(Date.now() + 2589200000000),
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none'
                        });
                        return res.status(200).send(user);
                    }
                }
            );
        }
        else return res.status(400).send({ message: "Invalid Email or Password!" });
    } catch (error) {
        console.error("Error while logging in:", error);
        return res.status(500).send({ message: "Error occurred while logging in" });
    }
});

// Route to handle otp request
router.post("/otp/send", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.getByEmail(email);

        if (!user) {
            return res.status(404).send({ message: "User does not exist!" });
        }

        const isMailSent = await Mailer.sendForgotPassOtp(user.name, user.email);

        if (isMailSent) {
            return res.status(200).send({ message: "Mail sent Successfully !" });
        } else {
            return res
                .status(400)
                .send({ message: "Something went wrong! Please try again." });
        }
    } catch (error) {
        console.error("Error while sending otp:", error);
        return res
            .status(500)
            .send({ message: "Something went wrong! Please try again." });
    }
});

// Route to handle otp validation
router.post("/otp/validate", async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.getByEmail(email);

        if (!user) {
            return res.status(404).send({ message: "User does not exist!" });
        }

        if (otp == user.otp) {
            res.cookie("otp", otp, {
                expires: new Date(Date.now() + 258920000000),
                httpOnly: true,
            });
            return res.sendStatus(200);
        } else {
            return res.status(400).send({ message: "Invalid OTP provided!" });
        }
    } catch (error) {
        console.error("Error while validating otp:", error);
        return res
            .status(500)
            .send({ message: "Something went wrong! Please try again." });
    }
});

//Route to handle reset password
router.post("/otp/reset", async (req, res) => {
    const { email, password } = req.body;
    const otp = req.cookies.otp ?? null;
    try {
        const user = await User.getByEmail(email);

        if (!user) {
            return res.status(404).send({ message: "User does not exist!" });
        }

        const result = await User.resetPassword(email, password, otp);

        if (!result) {
            return res.status(400).send({ message: "Invalid OTP provided!" });
        }

        return res.status(200).send({ message: "Password reset successfull !" });
    } catch (error) {
        console.error("Error while resetting password:", error);
        return res
            .status(500)
            .send({ message: "Something went wrong! Please try again." });
    }
});

// Route to handle otp request for user verfication
router.post("/verify/otp/send", async (req, res) => {
    const { name, email } = req.body;
    try {
        const isMailSent = await Mailer.sendUserVerificationOtp(name, email);

        if (isMailSent) {
            return res.status(200).send({ message: "Mail sent Successfully !" });
        } else {
            return res
                .status(400)
                .send({ message: "Something went wrong! Please try again." });
        }
    } catch (error) {
        console.error("Error while sending otp:", error);
        return res
            .status(500)
            .send({ message: "Something went wrong! Please try again." });
    }
});

// Route to handle otp validation for user verifcation
router.post("/verify/otp/validate", async (req, res) => {
    const { email, otp } = req.body;
    try {
        const isOtpValid = await Mailer.verifyUserVerificationOtp(email, otp);

        if (isOtpValid) {
            return res.sendStatus(200);
        } else {
            return res.status(400).send({ message: "Invalid OTP provided!" });
        }
    } catch (error) {
        console.error("Error while validating otp:", error);
        return res
            .status(500)
            .send({ message: "Something went wrong! Please try again." });
    }
});

router.post("/verify/email", async (req, res) => {
    const { email } = req.body;
    try {
        const isEmailExist = await User.getByEmail(email);
        if (isEmailExist) {
            return res.status(200).send({ message: "Email exist" });
        } else {
            return res.status(202).send({ message: "Email not exist" });
        }
    } catch (error) {
        console.error("Error while validating email:", error);
        return res
            .status(500)
            .send({ message: "Something went wrong! Please try again." });
    }
});

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
        prompt: "select_account",
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/failed",
        session: false,
        // successRedirect: '/'
    }),
    authService.signToken,
    (req, res) => {
        const cookie = new Cookie(req, res, { secure: true });
        cookie.set("jwtoken", req.token, {
            secure: true,
            httpOnly: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60,
        });
        res.send("<script>window.close()</script>");
    }
);

router.get("/logout", (req, res) => {
    // const cookie = new Cookie(req, res, { secure: true });
    // cookie.set("jwtoken", "", {
    //     secure: true,
    //     httpOnly: true,
    //     maxAge: 0,
    //     sameSite: "none",
    //     overwrite: true,
    // });
    res.cookie("jwtoken", '', {
        expires: new Date(Date.now() - 2589200000000),
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    // res.send("<script>window.close()</script>");
    return res.sendStatus(200);
});

module.exports = router;
