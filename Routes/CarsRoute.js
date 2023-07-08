const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const CarDetails = require('../Models/CarDetailsModel');

router.use(cookieParser())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Route to create car details
router.post('/', async (req, res) => {
    const {
        brand,
        year,
        model,
        fuelType,
        registrationYear,
        variant,
        ownership,
        kmDriven,
        transmission,
        pinCode,
        location,
        registrationNumber,
        sellerId,
        nearestRTO,
        price,
        carType,
        tags
    } = req.body;

    try {
        const newCarDetails = await CarDetails.create(
            brand,
            year,
            model,
            fuelType,
            registrationYear,
            variant,
            ownership,
            kmDriven,
            transmission,
            pinCode,
            location,
            registrationNumber,
            sellerId,
            nearestRTO,
            price,
            carType,
            tags
        );

        res.status(201).json(newCarDetails);
    } catch (error) {
        console.error('Error creating car details:', error);
        res.status(500).json({ message: 'Error occurred while creating car details' });
    }
});

// Route to get all car details
router.get('/', async (req, res) => {
    try {
        const carDetails = await CarDetails.get();
        res.json(carDetails);
    } catch (error) {
        console.error('Error getting car details:', error);
        res.status(500).json({ message: 'Error occurred while getting car details' });
    }
});

// Route to get car details by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const carDetails = await CarDetails.getById(id);

        if (carDetails) {
            res.json(carDetails);
        } else {
            res.status(404).json({ message: 'Car details not found' });
        }
    } catch (error) {
        console.error('Error getting car details by ID:', error);
        res.status(500).json({ message: 'Error occurred while getting car details' });
    }
});

// Route to update car details
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
        brand,
        year,
        model,
        fuelType,
        registrationYear,
        variant,
        ownership,
        kmDriven,
        transmission,
        pinCode,
        location,
        registrationNumber,
        sellerId,
        nearestRTO,
        price,
        carType,
        tags
    } = req.body;

    try {
        const updatedCarDetails = await CarDetails.update(
            id,
            brand,
            year,
            model,
            fuelType,
            registrationYear,
            variant,
            ownership,
            kmDriven,
            transmission,
            pinCode,
            location,
            registrationNumber,
            sellerId,
            nearestRTO,
            price,
            carType,
            tags
        );

        if (updatedCarDetails) {
            res.json(updatedCarDetails);
        } else {
            res.status(404).json({ message: 'Car details not found' });
        }
    } catch (error) {
        console.error('Error updating car details:', error);
        res.status(500).json({ message: 'Error occurred while updating car details' });
    }
});

// Route to delete car details
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCarDetails = await CarDetails.delete(id);

        if (deletedCarDetails) {
            res.json({ message: 'Car details deleted successfully' });
        } else {
            res.status(404).json({ message: 'Car details not found' });
        }
    } catch (error) {
        console.error('Error deleting car details:', error);
        res.status(500).json({ message: 'Error occurred while deleting car details' });
    }
});

// Route to buy a car
router.post('/:id/buy', async (req, res) => {
    const { id } = req.params;
    const { buyerId } = req.body;

    try {
        const carDetails = await CarDetails.getById(id);

        if (!carDetails) {
            return res.status(404).json({ message: 'Car details not found' });
        }

        if (carDetails.buyerId) {
            return res.status(400).json({ message: 'Car is already sold' });
        }

        await CarDetails.buy(id, buyerId);

        res.status(200).json({ message: 'Car purchased successfully' });
    } catch (error) {
        console.error('Error buying car:', error);
        res.status(500).json({ message: 'Error occurred while buying the car' });
    }
});


module.exports = router;
