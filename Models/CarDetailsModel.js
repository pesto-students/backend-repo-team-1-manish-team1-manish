const sql = require("../DB/PostgresSql");

const CarDetails = {};

// CREATE CAR DETAILS
CarDetails.create = async (brand, year, model, fuelType, registrationYear, variant, ownership, kmDriven, transmission, pinCode, location, registrationNumber, sellerId, nearestRTO, price, carType, tags) => {
    try {
        await sql`
      INSERT INTO Car_Details (Id, Brand, Year, Model, FuelType, RegistrationYear, Variant, Ownership, KMDriven, Transmission, PinCode, Location, RegistrationNumber, SellerId, NearestRTO, Price, CarType, Tags)
      VALUES (gen_random_uuid(), ${brand}, ${year}, ${model}, ${fuelType}, ${registrationYear}, ${variant}, ${ownership}, ${kmDriven}, ${transmission}, ${pinCode}, ${location}, ${registrationNumber}, ${sellerId}, ${nearestRTO}, ${price}, ${carType}, ${tags})
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
      SELECT * FROM Car_Details
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
      SELECT * FROM Car_Details WHERE Id = ${id}
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
      SELECT * FROM Car_Details WHERE RegistrationNumber = ${registrationNumber}
    `;
    } catch (error) {
        console.error('Error getting car details by registration number:', error);
        throw error;
    }
};

// UPDATE CAR DETAILS
CarDetails.update = async (id, brand, year, model, fuelType, registrationYear, variant, ownership, kmDriven, transmission, pinCode, location, registrationNumber, sellerId, nearestRTO, price, carType, tags) => {
    try {
        let query = sql`UPDATE Car_Details SET Brand = ${brand}, Year = ${year}, Model = ${model}, FuelType = ${fuelType}, RegistrationYear = ${registrationYear}, Variant = ${variant}, Ownership = ${ownership}, KMDriven = ${kmDriven}, Transmission = ${transmission}, PinCode = ${pinCode}, Location = ${location}, RegistrationNumber = ${registrationNumber}, SellerId = ${sellerId}, NearestRTO = ${nearestRTO}, Price = ${price}, CarType = ${carType}, Tags = ${tags} WHERE Id = ${id}`;

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
      DELETE FROM Car_Details WHERE Id = ${id}
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
      UPDATE Car_Details SET BuyerId = ${buyerId} WHERE Id = ${id}
    `;

        return await query;
    } catch (error) {
        console.error('Error buying car:', error);
        throw error;
    }
};

module.exports = CarDetails;
