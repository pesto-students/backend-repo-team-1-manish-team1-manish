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

            if (!user) {
                return res.status(404).send({ message: "User does not exist!" });
            }
            return res.status(200).send(user);
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
        const { name, first_name, last_name, email, auth_provider } = req.authData;
        try {
            const user = await User.getByEmail(email);
            if (user) {
                return res.status(409).send({ message: "User already exist! Please Login." });
            }
            const createdUser = await User.create(name, first_name, last_name, email, null, null, auth_provider);
            res.status(201).send(createdUser);
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
    const { firstName, lastName, phoneNo } = req.body;
    try {
        const updatedUser = await User.update(id, `${firstName} ${lastName}`, firstName, lastName, phoneNo);

        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User does not exist!' });
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

// Route to get user orders
router.get('/users/:id/orders', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.getById(id);

        if (user) {
            const order_details = await User.getOrders(id);
            res.status(200).json(order_details);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error getting user orders:', error);
        res.status(500).json({ message: 'Error occurred while fetching orders' });
    }
});

// Route to get user bookmarks
router.get('/users/:id/bookmarks', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.getById(id);

        if (user) {
            const bookmarks = await User.getBookmarks(id);
            res.status(200).json(bookmarks);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error getting user bookmarks:', error);
        res.status(500).json({ message: 'Error occurred while fetching bookmarks' });
    }
});

// Route to create wishlists
router.post('/users/:id/bookmarks', async (req, res) => {
    const { id } = req.params;
    const { bookmarkId } = req.body;

    try {
        const user = await User.getById(id);

        if (user) {
            await User.addBookmarks(id, bookmarkId);
            res.status(200).json({ message: 'Bookmarks created successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error creating bookmarks:', error);
        res.status(500).json({ message: 'Error occurred while creating bookmarks' });
    }
});

// Route to remove bookmark IDs
router.delete('/users/:id/bookmarks', async (req, res) => {
    const { id } = req.params;
    const { bookmarkId } = req.body;
    try {
        const user = await User.getById(id);

        if (user) {
            await User.removeBookmarks(id, bookmarkId);
            res.status(200).json({ message: 'Bookmark IDs removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error removing bookmark IDs:', error);
        res.status(500).json({ message: 'Error occurred while removing bookmark IDs' });
    }
});

// Route to clear all bookmark IDs
router.delete('/users/:id/bookmarks/clear', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.getById(id);

        if (user) {
            await User.clearBookmarks(id);
            res.status(200).json({ message: 'All bookmark IDs cleared successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error clearing all bookmark IDs:', error);
        res.status(500).json({ message: 'Error occurred while clearing all bookmark IDs' });
    }
});



module.exports = router;
