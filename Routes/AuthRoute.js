const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
const User = require('../Models/UserModel');

router.use(cookieParser())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/login/success", async (req, res) => {
    const { email } = req.authData;
    if (req.authData && email) {

        try {
            const user = await User.getByEmail(email);

            if (!user[0]) {
                return res.status(404).send({ message: "User does not exist!" });
            }
            return res.status(200).send(user[0])
        } catch (error) {
            console.error("Error while logging in:", error);
            res.status(500).send({ message: "Error occurred while logging in" });
        }
    }
    else {
        res.clearCookie('jwtoken', { path: '/' });
        res.status(401).send({ message: "Un-Authorized! Login unsuccessfull" })
    }
})
router.get("/failed", (req, res) => {
    return res.status(403).send({
        message: "Authentication Failed, Forbidden!"
    });
})

router.get("/register/success", async (req, res) => {
    if (req.authData && req.authData.email) {
        // res.status(200).send(req.authData)
        const { name, firstName, lastName, email, phoneNo, authProvider } = req.authData;

        try {
            const user = await User.getByEmail(email);
            if (user[0]) {
                return res.status(409).send({ message: "User already exist! Please Login." });
            }
            await User.create(name, firstName, lastName, email, phoneNo, null, authProvider, null);
            res.status(201).send(req.authData);
        } catch (error) {
            console.error("Error while registering user:", error);
            res.status(500).send({ message: "Error occurred while registering user" });
        }
    }
    else {
        res.clearCookie('jwtoken', { path: '/' });
        res.status(401).send({ message: "Un-Authorized! Registration unsuccessfull" })
    }
})

// Route to get user profile
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.getById(id);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ message: 'Error occurred while getting user profile' });
    }
});

// Route to update user profile
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, firstName, lastName, phoneNo, authProvider, bookmarkIds } = req.body;

    try {
        const updatedUser = await User.update(id, name, firstName, lastName, phoneNo, authProvider, bookmarkIds);

        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error occurred while updating user profile' });
    }
});

// Route to delete user account
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.delete(id);

        if (deletedUser) {
            res.status(200).json({ message: 'User account deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ message: 'Error occurred while deleting user account' });
    }
});


module.exports = router;