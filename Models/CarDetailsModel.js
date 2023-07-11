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
        return (await sql`
      SELECT * FROM car_details WHERE Id = ${id}
    `)[0];
    } catch (error) {
        console.error('Error getting car details by ID:', error);
        throw error;
    }
};

// GET CAR DETAILS BY REGISTRATION NUMBER
CarDetails.getByRegistrationNumber = async (registrationNumber) => {
    try {
        return (await sql`
      SELECT * FROM car_details WHERE RegistrationNumber = ${registrationNumber}
    `)[0];
    } catch (error) {
        console.error('Error getting car details by registration number:', error);
        throw error;
    }
};

// UPDATE CAR DETAILS
CarDetails.update = async (
    id,
    {
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
        images
    } = {}
) => {
    try {
        let query = sql`UPDATE car_details SET Id = ${id}
        ${fuelType ? sql`, FualType = ${fuelType}` : sql``}
        ${fuelCapacity ? sql`, FualCapacity = ${fuelCapacity}` : sql``}
        ${registrationYear ? sql`, RegistrationYear = ${registrationYear}` : sql``}
        ${ownership ? sql`, Ownership = ${ownership}` : sql``}
        ${kmDriven ? sql`, KmDriven = ${kmDriven}` : sql``}
        ${transmission ? sql`, Transmission = ${transmission}` : sql``}
        ${transmissionShort ? sql`, TransmissionShort = ${transmissionShort}` : sql``}
        ${insurance ? sql`, Insaurance = ${insurance}` : sql``}
        ${registrationState ? sql`, RegistrationState = ${registrationState}` : sql``}
        ${registrationNumber ? sql`, RegistrationNumber = ${registrationNumber}` : sql``}
        ${nearestRtoOffice ? sql`, NearestRtoOffice = ${nearestRtoOffice}` : sql``}
        ${images ? sql`, Images = ${images}` : sql``}
        WHERE Id = ${id}
        `;
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
        let query = sql`SELECT DISTINCT Brand FROM car_details`;
        return await query;
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
        let query = sql`SELECT * FROM car_details WHERE 1=1
      ${brands && brands[0].length > 0 ? sql` AND Brand = ANY (${brands})` : sql``}
      ${minPrice ? sql` AND Price >= ${minPrice}` : sql``}
      ${maxPrice ? sql` AND Price <= ${maxPrice}` : sql``}
      ${models && models[0].length > 0 ? sql` AND Model = ANY (${models})` : sql``}
      ${year ? sql` AND Year = ${year}` : sql``}
      ${fuelType ? sql` AND FualType = ${fuelType}` : sql``}
      ${kmDriven ? sql` AND KmDriven = ${kmDriven}` : sql``}
      ${transmission ? sql` AND Transmission = ${transmission}` : sql``}
      ${nearestRtoOffice ? sql` AND NearestRtoOffice = ${nearestRtoOffice}` : sql``}
      `;

        return await query;
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
        FROM car_details
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
        SELECT Type, COUNT(*) AS CarCount
        FROM Car_Details
        GROUP BY Type
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
        SELECT NearestRtoOffice, COUNT(*) AS CarCount
        FROM Car_Details
        GROUP BY NearestRtoOffice
      `;
    } catch (error) {
        console.error('Error fetching available RTO offices:', error);
        throw error;
    }
};


module.exports = CarDetails;
