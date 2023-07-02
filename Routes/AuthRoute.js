const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

router.use(cookieParser())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/login/success", (req, res) => {
    if (req.authData) {
        res.status(200).send(req.authData)
    }
    else {
        res.status(201).send({ code: 401, message: "Un-Authorized! Login unsuccessfull" })
    }
})

router.get("/register/success", (req, res) => {
    if (req.authData) {
        res.status(200).send(req.authData)
    }
    else {
        res.status(201).send({ code: 401, message: "Un-Authorized! Registration unsuccessfull" })
    }
})

module.exports = router;