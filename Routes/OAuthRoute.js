const express = require('express');
const router = express.Router();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authService = require('../Middleware/AuthService');
require('dotenv').config();
require('../Middleware/Passport');

router.use(cookieParser())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// router.get("/", authService.verifyToken, (req, res) => {
//     return res.send(`Welcome ${req.authData.displayName}`)
// })

router.get("/failed", (req, res) => {
    return res.status(403).send({
        code: 403, message: "Authentication Failed, Forbidden!"
    });
})

router.get('/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
        session: false,
        // successRedirect: '/'
    }),
    authService.signToken,
    (req, res) => {
        console.log("called");
        res.cookie("jwtoken", req.token, {
            expires: new Date(Date.now() + 258920000000000),
            httpOnly: true
        });
        res.send('<script>window.close()</script>');
    }
);

router.get("/logout", (req, res) => {
    req.logOut();
    res.clearCookie('jwtoken', { path: '/' });
    res.sendStatus(200);
})

module.exports = router;