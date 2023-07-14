const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const CarDetails = require("../Models/CarDetailsModel");

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Route to create car details
router.post("/", async (req, res) => {
  const {
    brand,
    year,
    model,
    fuelType,
    fuelCapacity,
    registrationYear,
    engine,
    variant,
    ownership,
    kmDriven,
    transmission,
    transmissionShort,
    insurance,
    pinCode,
    registrationState,
    city,
    registrationNumber,
    sellerId,
    buyerId,
    nearestRtoOffice,
    price,
    type,
    tags,
    images,
    carApiId,
  } = req.body;

  try {
    const newCarDetails = await CarDetails.create(
      brand,
      year,
      model,
      fuelType,
      fuelCapacity,
      registrationYear,
      engine,
      variant,
      ownership,
      kmDriven,
      transmission,
      transmissionShort,
      insurance,
      pinCode,
      registrationState,
      city,
      registrationNumber,
      sellerId,
      buyerId,
      nearestRtoOffice,
      price,
      type,
      tags,
      images,
      carApiId
    );

    return res.status(201).json(newCarDetails);
  } catch (error) {
    console.error("Error creating car details:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while creating car details" });
  }
});

// Route to get all car details
router.get("/", async (req, res) => {
  try {
    const carDetails = await CarDetails.get();
    return res.json(carDetails);
  } catch (error) {
    console.error("Error getting car details:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while getting car details" });
  }
});

// Route to get car details by ID
router.get("/ids/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const carDetails = await CarDetails.getById(id);

    if (carDetails) {
      return res.json(carDetails);
    } else {
      return res.status(404).json({ message: "Car details not found" });
    }
  } catch (error) {
    console.error("Error getting car details by ID:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while getting car details" });
  }
});

// Route to update car details
router.put("/ids/:id", async (req, res) => {
  const { id } = req.params;
  const {
    fuelType,
    fuelCapacity,
    registrationYear,
    ownership,
    kmDriven,
    transmission,
    transmissionShort,
    insurance,
    registrationState,
    registrationNumber,
    nearestRtoOffice,
    images,
  } = req.body;

  try {
    const carDetailsById = await CarDetails.getById(id);
    // const carDetailsByRegNo = await CarDetails.getByRegistrationNumber(registrationNumber);
    if (carDetailsById) {
      await CarDetails.update(id, {
        fuelType,
        fuelCapacity,
        registrationYear,
        ownership,
        kmDriven,
        transmission,
        transmissionShort,
        insurance,
        registrationState,
        registrationNumber,
        nearestRtoOffice,
        images,
      });

      return res.json({ message: "Car details updated successfully" });
    } else {
      return res.status(404).json({ message: "Car details not found" });
      // return res.status(404).json({ message: 'Car details not found, Id or registrationNumber must be valid altogether.' });
    }
  } catch (error) {
    console.error("Error updating car details:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while updating car details" });
  }
});

// Route to delete car details
router.delete("/ids/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const carDetails = await CarDetails.getById(id);

    if (carDetails) {
      await CarDetails.delete(id);
      return res.json({ message: "Car details deleted successfully" });
    } else {
      return res.status(404).json({ message: "Car details not found" });
    }
  } catch (error) {
    console.error("Error deleting car details:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while deleting car details" });
  }
});

// Route to buy a car
router.post("/ids/:id/buy", async (req, res) => {
  const { id } = req.params;
  const { buyerId } = req.body;

  try {
    const carDetails = await CarDetails.getById(id);

    if (!carDetails) {
      return res.status(404).json({ message: "Car details not found" });
    }

    if (carDetails.buyerId) {
      return res.status(400).json({ message: "Car is already sold" });
    }

    await CarDetails.buy(id, buyerId);

    return res.status(200).json({ message: "Car purchased successfully" });
  } catch (error) {
    console.error("Error buying car:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while buying the car" });
  }
});

// Route to fetch car brands for a range of price
router.get("/brands/:minPrice/:maxPrice", async (req, res) => {
  const { minPrice, maxPrice } = req.params;

  try {
    const carBrands = await CarDetails.getBrandsByPriceRange(
      minPrice,
      maxPrice
    );
    return res.status(200).json(carBrands);
  } catch (error) {
    console.error("Error fetching car brands by price range:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching car brands" });
  }
});

// Route to fetch car types based on price range and brand
router.get("/brands/:minPrice/:maxPrice/types/:brand", async (req, res) => {
  const { minPrice, maxPrice, brand } = req.params;

  try {
    const carTypes = await CarDetails.getCarTypesByPriceRangeAndBrand(
      minPrice,
      maxPrice,
      brand
    );
    return res.status(200).json(carTypes);
  } catch (error) {
    console.error("Error fetching car types by price range and brand:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching car types" });
  }
});

// Route to fetch car details based on price range, brand, and car type
router.get(
  "/brands/:minPrice/:maxPrice/types/:brand/:type",
  async (req, res) => {
    const { minPrice, maxPrice, brand, type } = req.params;

    try {
      const carDetails = await CarDetails.getCarDetailsByPriceRangeBrandAndType(
        minPrice,
        maxPrice,
        brand,
        type
      );
      return res.status(200).json(carDetails);
    } catch (error) {
      console.error(
        "Error fetching car details by price range, brand, and type:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error occurred while fetching car details" });
    }
  }
);

// Route to fetch all car brands
router.get("/brands", async (req, res) => {
  try {
    const carBrands = await CarDetails.getAllCarBrands();
    return res.status(200).json(carBrands);
  } catch (error) {
    console.error("Error fetching all car brands:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching car brands" });
  }
});

// Route to fetch car models with their brand
router.get("/models/", async (req, res) => {
  try {
    const carModels = await CarDetails.getCarModelsWithBrand();
    return res.status(200).json(carModels);
  } catch (error) {
    console.error("Error fetching car models with brand:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching car models" });
  }
});

// Route to fetch car details based on optional query parameters
router.get("/search", async (req, res) => {
  const {
    brands,
    minPrice,
    maxPrice,
    models,
    year,
    fuelType,
    kmDriven,
    transmission,
    nearestRtoOffice,
  } = req.query;

  try {
    const carDetails = await CarDetails.getCarDetailsWithOptionalParameters(
      brands ? [brands.split(",")] : null,
      minPrice,
      maxPrice,
      models ? [models.split(",")] : null,
      year,
      fuelType,
      kmDriven,
      transmission,
      nearestRtoOffice
    );
    return res.json(carDetails);
  } catch (error) {
    console.error(
      "Error fetching car details with optional parameters:",
      error
    );
    return res
      .status(500)
      .json({ message: "Error occurred while fetching car details" });
  }
});

// Route to fetch available car fuel types and the count of cars for each fuel type
router.get("/fuel-types", async (req, res) => {
  try {
    const fuelTypes = await CarDetails.getAvailableFuelTypes();
    return res.status(200).json(fuelTypes);
  } catch (error) {
    console.error("Error fetching available car fuel types:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching car fuel types" });
  }
});

// Route to fetch available car types and the count of cars for each car type
router.get("/car-types", async (req, res) => {
  try {
    const carTypes = await CarDetails.getAvailableCarTypes();
    return res.status(200).json(carTypes);
  } catch (error) {
    console.error("Error fetching available car types:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching car types" });
  }
});

// Route to fetch count of cars that have automatic or manual transmission
router.get("/transmission-count", async (req, res) => {
  try {
    const transmissionCount = await CarDetails.getTransmissionCount();
    return res.status(200).json(transmissionCount);
  } catch (error) {
    console.error("Error fetching car transmission count:", error);
    return res.status(500).json({
      message: "Error occurred while fetching car transmission count",
    });
  }
});

// Route to fetch available ownerships and their count
router.get("/ownerships", async (req, res) => {
  try {
    const ownerships = await CarDetails.getAvailableOwnerships();
    return res.status(200).json(ownerships);
  } catch (error) {
    console.error("Error fetching available ownerships:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching ownerships" });
  }
});

// Route to fetch all unique available RTO offices and their count
router.get("/rto-offices", async (req, res) => {
  try {
    const rtoOffices = await CarDetails.getAvailableRTOOffices();
    return res.status(200).json(rtoOffices);
  } catch (error) {
    console.error("Error fetching available RTO offices:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while fetching RTO offices" });
  }
});

// Route to fetch car details based on price range, Brand, Model
router.get(
  "/brands/:brands/models/:models/price/:minPrice/:maxPrice/",
  async (req, res) => {
    const { brands, minPrice, maxPrice, models } = req.params;

    try {
      const rtoOffices = await CarDetails.getCarDetailsWithOptionalParameters(
        brands,
        minPrice,
        maxPrice,
        models
      );
      return res.status(200).json(rtoOffices);
    } catch (error) {
      console.error(
        "Error fetching CarDetails by brand, model and price range:",
        error
      );
      return res
        .status(500)
        .json({
          message:
            "Error occurred while fetching CarDetails by brand, model and price range",
        });
    }
  }
);

module.exports = router;
