const sql = require("../DB/PostgresSql");

const CarDetails = {};

// CREATE CAR DETAILS
CarDetails.create = async (brand, year, model, fuelType, fuelCapacity, registrationYear, engine, variant, ownership, kmDriven, transmission, transmissionShort, insurance, pinCode, registrationState, city, registrationNumber, sellerId, buyerId, nearestRtoOffice, price, type, tags, images, carApiId) => {
    try {
        await sql`
      INSERT INTO car_details (Id, Brand, Year, Model, FualType, FualCapacity, RegistrationYear, Engine, Variant, Ownership, KmDriven, Transmission, TransmissionShort, Insaurance, PinCode, RegistrationState, City, RegistrationNumber, SellerId, BuyerId, NearestRtoOffice, Price, Type, Tags, Images, carApiId)
      VALUES (gen_random_uuid(), ${brand}, ${year}, ${model}, ${fuelType}, ${fuelCapacity}, ${registrationYear}, ${engine}, ${variant}, ${ownership}, ${kmDriven}, ${transmission}, ${transmissionShort}, ${insurance}, ${pinCode}, ${registrationState}, ${city}, ${registrationNumber}, ${sellerId}, ${buyerId}, ${nearestRtoOffice}, ${price}, ${type}, ${tags}, ${images}, ${carApiId})
    `;

        const newCarDetails = await CarDetails.getByRegistrationNumber(registrationNumber);
        return newCarDetails;
    } catch (error) {
        console.error('Error creating car details:', error);
        throw error;
    }
};

// GET ALL CAR DETAILS
CarDetails.get = async () => {
    try {
        return await sql`
      SELECT * FROM car_details
    `;
    } catch (error) {
        console.error('Error getting car details:', error);
        throw error;
    }
};

// GET CAR DETAILS BY ID
CarDetails.getById = async (id) => {
    try {
        return await sql`
      SELECT * FROM car_details WHERE Id = ${id}
    `;
    } catch (error) {
        console.error('Error getting car details by ID:', error);
        throw error;
    }
};

// GET CAR DETAILS BY REGISTRATION NUMBER
CarDetails.getByRegistrationNumber = async (registrationNumber) => {
    try {
        return await sql`
      SELECT * FROM car_details WHERE RegistrationNumber = ${registrationNumber}
    `;
    } catch (error) {
        console.error('Error getting car details by registration number:', error);
        throw error;
    }
};

// UPDATE CAR DETAILS
CarDetails.update = async (id, brand, year, model, fuelType, fuelCapacity, registrationYear, engine, variant, ownership, kmDriven, transmission, transmissionShort, insurance, pinCode, registrationState, city, registrationNumber, sellerId, buyerId, nearestRtoOffice, price, type, tags, images, carApiId) => {
    try {
        let query = sql`
      UPDATE car_details SET Brand = ${brand}, Year = ${year}, Model = ${model}, FualType = ${fuelType}, FualCapacity = ${fuelCapacity}, RegistrationYear = ${registrationYear}, Engine = ${engine}, Variant = ${variant}, Ownership = ${ownership}, KmDriven = ${kmDriven}, Transmission = ${transmission}, TransmissionShort = ${transmissionShort}, Insaurance = ${insurance}, PinCode = ${pinCode}, RegistrationState = ${registrationState}, City = ${city}, RegistrationNumber = ${registrationNumber}, SellerId = ${sellerId}, BuyerId = ${buyerId}, NearestRtoOffice = ${nearestRtoOffice}, Price = ${price}, Type = ${type}, Tags = ${tags}, Images = ${images}, carApiId = ${carApiId} WHERE Id = ${id}`;

        return await query;
    } catch (error) {
        console.error('Error updating car details:', error);
        throw error;
    }
};

// DELETE CAR DETAILS
CarDetails.delete = async (id) => {
    try {
        return await sql`
      DELETE FROM car_details WHERE Id = ${id}
    `;
    } catch (error) {
        console.error('Error deleting car details:', error);
        throw error;
    }
};


// BUY CAR
CarDetails.buy = async (id, buyerId) => {
    try {
        let query = sql`
      UPDATE car_details SET BuyerId = ${buyerId} WHERE Id = ${id}
    `;

        return await query;
    } catch (error) {
        console.error('Error buying car:', error);
        throw error;
    }
};

// Fetch car brands for a range of prices
CarDetails.getBrandsByPriceRange = async (minPrice, maxPrice) => {
    try {
        return await sql`
      SELECT DISTINCT Brand FROM car_details WHERE Price >= ${minPrice} AND Price <= ${maxPrice}
    `;
    } catch (error) {
        console.error('Error getting car brands by price range:', error);
        throw error;
    }
};

// Fetch car types by price range and brand
CarDetails.getCarTypesByPriceRangeAndBrand = async (minPrice, maxPrice, brand) => {
    try {
        return await sql`
      SELECT DISTINCT Type FROM car_details WHERE Price >= ${minPrice} AND Price <= ${maxPrice} AND Brand = ${brand}
    `;
    } catch (error) {
        console.error('Error getting car types by price range and brand:', error);
        throw error;
    }
};

// Fetch car details by price range, brand, and car type
CarDetails.getCarDetailsByPriceRangeBrandAndType = async (minPrice, maxPrice, brand, type) => {
    try {
        return await sql`
      SELECT * FROM car_details WHERE Price >= ${minPrice} AND Price <= ${maxPrice} AND Brand = ${brand} AND Type = ${type}
    `;
    } catch (error) {
        console.error('Error getting car details by price range, brand, and type:', error);
        throw error;
    }
};

// Fetch all car brands
CarDetails.getAllCarBrands = async () => {
    try {
        return await sql`
      SELECT DISTINCT Brand FROM car_details
    `;
    } catch (error) {
        console.error('Error getting all car brands:', error);
        throw error;
    }
};

// Fetch car models with their brand
CarDetails.getCarModelsWithBrand = async () => {
    try {
        return await sql`
      SELECT Brand, Model FROM car_details
    `;
    } catch (error) {
        console.error('Error getting car models with brand:', error);
        throw error;
    }
};

// Fetch car details based on optional query parameters
CarDetails.getCarDetailsWithOptionalParameters = async (brands, minPrice, maxPrice, models, year, fuelType, kmDriven, transmission, nearestRtoOffice) => {
    try {
        let query = `
      SELECT * FROM car_details WHERE 1=1`;

        if (brands && brands.length > 0) {
            query = query.concat(` AND Brand IN (${brands})`);
        }

        if (minPrice) {
            query = query.concat(` AND Price >= ${minPrice}`);
        }

        if (maxPrice) {
            query = query.concat(` AND Price <= ${maxPrice}`);
        }

        if (models && models.length > 0) {
            query = query.concat(` AND Model IN (${models})`);
        }

        if (year) {
            query = query.concat(` AND Year = ${year}`);
        }

        if (fuelType) {
            query = query.concat(` AND FualType = ${fuelType}`);
        }

        if (kmDriven) {
            query = query.concat(` AND KmDriven = ${kmDriven}`);
        }

        if (transmission) {
            query = query.concat(` AND Transmission = ${transmission}`);
        }

        if (nearestRtoOffice) {
            query = query.concat(` AND NearestRtoOffice = ${nearestRtoOffice}`);
        }

        return await sql`${query}`;
    } catch (error) {
        console.error('Error getting car details with optional parameters:', error);
        throw error;
    }
};

// GET AVAILABLE CAR FUEL TYPES AND COUNT
CarDetails.getAvailableFuelTypes = async () => {
    try {
        return await sql`
        SELECT FuelType, COUNT(*) AS CarCount
        FROM Car_Details
        GROUP BY FuelType
      `;
    } catch (error) {
        console.error('Error fetching available car fuel types:', error);
        throw error;
    }
};

// GET AVAILABLE CAR TYPES AND COUNT
CarDetails.getAvailableCarTypes = async () => {
    try {
        return await sql`
        SELECT CarType, COUNT(*) AS CarCount
        FROM Car_Details
        GROUP BY CarType
      `;
    } catch (error) {
        console.error('Error fetching available car types:', error);
        throw error;
    }
};

// GET TRANSMISSION COUNT
CarDetails.getTransmissionCount = async () => {
    try {
        return await sql`
        SELECT Transmission, COUNT(*) AS CarCount
        FROM Car_Details
        WHERE Transmission IN ('Automatic', 'Manual')
        GROUP BY Transmission
      `;
    } catch (error) {
        console.error('Error fetching car transmission count:', error);
        throw error;
    }
};

// GET AVAILABLE OWNERSHIPS AND COUNT
CarDetails.getAvailableOwnerships = async () => {
    try {
        return await sql`
        SELECT Ownership, COUNT(*) AS CarCount
        FROM Car_Details
        GROUP BY Ownership
      `;
    } catch (error) {
        console.error('Error fetching available ownerships:', error);
        throw error;
    }
};

// GET ALL UNIQUE AVAILABLE RTO OFFICES AND COUNT
CarDetails.getAvailableRTOOffices = async () => {
    try {
        return await sql`
        SELECT NearestRTO, COUNT(*) AS CarCount
        FROM Car_Details
        GROUP BY NearestRTO
      `;
    } catch (error) {
        console.error('Error fetching available RTO offices:', error);
        throw error;
    }
};


module.exports = CarDetails;
