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
        ${registrationYear
        ? sql`, RegistrationYear = ${registrationYear}`
        : sql``
      }
        ${ownership ? sql`, Ownership = ${ownership}` : sql``}
        ${kmDriven ? sql`, KmDriven = ${kmDriven}` : sql``}
        ${transmission ? sql`, Transmission = ${transmission}` : sql``}
        ${transmissionShort
        ? sql`, TransmissionShort = ${transmissionShort}`
        : sql``
      }
        ${insurance ? sql`, Insaurance = ${insurance}` : sql``}
        ${registrationState
        ? sql`, RegistrationState = ${registrationState}`
        : sql``
      }
        ${registrationNumber
        ? sql`, RegistrationNumber = ${registrationNumber}`
        : sql``
      }
        ${nearestRtoOffice
        ? sql`, NearestRtoOffice = ${nearestRtoOffice}`
        : sql``
      }
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
      ${nearestRtoOffice
        ? sql` AND NearestRtoOffice = ${nearestRtoOffice}`
        : sql``
      }
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

// GET CAR DETAILS
CarDetails.getCarDetailsById = async (id) => {
  const query1 = sql`
  SELECT cd1.id, cd1.brand, cd1.year, cd1.model, cd1.fueltype,
    cd1.fualcapacity, cd1.registrationyear, cd1.registrationstate, 
    cd1.engine, cd1.variant, cd1.ownership, cd1.kmdriven, cd1.transmission,
    cd1.transmissionshort, cd1.insaurance, cd1.pincode, cd1.registrationnumber,
    cd1.city, cd1.sellerid, cd1.buyerid, cd1.nearestrtooffice, cd1.price, cd1.type,
    cd1.tags, cd1.images, cd1.carapiid,
    cd2.id AS "ModelId", cd2.engine_power_ps AS "Max Power (bhp)",
    cd2.engine_cc AS "Engine", cd2.engine_torque_nm AS "Torque",
    cd2.seats AS "Seats", cd2.engine_cc AS "Displacement (cc)",
    'Drum' AS "Brake Type (rear)", 'Disc' AS "Brake Type (front)",
    cd2.engine_cyl AS "Cylinders", cd2.engine_power_rpm AS "Max Power (rpm)",
    'BSVI' AS "Emission Standard", cd2.fuel_cap_l AS "Fuel Tank Capacity",
    cd2.body AS "Body Type", 506 AS "Boot Space (Litres)"
  FROM car_details AS cd1
  LEFT JOIN car_data AS cd2 ON cd1.carapiid = cd2.id
  WHERE cd1.id = ${id}
  `;
  const { carOverview, carFeatures, carSpecifications } = await query1
    .then((result) => {
      const carOverview = {
        Id: result[0].id,
        Brand: result[0].brand,
        Year: result[0].year,
        Model: result[0].model,
        FualType: result[0].fueltype,
        FualCapacity: result[0].fualcapacity,
        RegistrationYear: result[0].registrationyear,
        Engine: result[0].engine,
        Variant: result[0].variant,
        Ownership: result[0].ownership,
        KmDriven: result[0].kmdriven,
        Transmission: result[0].transmission,
        TransmissionShort: result[0].transmissionshort,
        Insaurance: result[0].insaurance,
        PinCode: result[0].pincode,
        RegistrationState: result[0].registrationstate,
        City: result[0].city,
        RegistrationNumber: result[0].registrationnumber,
        SellerId: result[0].sellerid,
        BuyerId: result[0].buyerid,
        NearestRtoOffice: result[0].nearestrtooffice,
        Price: result[0].price,
        Type: result[0].type,
        Tags: result[0].tags,
        Images: result[0].images,
        carApiId: result[0].carapiid
      }

      // Map the fetched data to the CarSpecifications object
      const carSpecifications = {
        id: result[0]["ModelId"],
        "Max Power (bhp)": result[0]["Max Power (bhp)"],
        "Engine": result[0]["Engine"],
        "Torque": result[0]["Torque"],
        "Seats": result[0]["Seats"] ? result[0]["Seats"] : '4',
        "Displacement (cc)": result[0]["Displacement (cc)"],
        "Brake Type (rear)": result[0]["Brake Type (rear)"],
        "Brake Type (front)": result[0]["Brake Type (front)"],
        "Cylinders": result[0]["Cylinders"],
        "Max Power (rpm)": result[0]["Max Power (rpm)"] ? result[0]["Max Power (rpm)"] : 'NA',
        "Emission Standard": result[0]["Emission Standard"],
        "Fuel Tank Capacity": result[0]["Fuel Tank Capacity"],
        "Body Type": result[0]["Body Type"],
        "Boot Space (Litres)": result[0]["Boot Space (Litres)"]
      };

      // Map the missing data in CarFeatures object
      const carFeatures = {
        id: result[0]["ModelId"],
        "Power Steering": true,
        "Heater": true,
        "Anti lock Braking System": true,
        "Power Window Front": true,
        "Adjustable Head Lights": true,
        "Central Locking": true,
        "Air Conditioning": true,
        "Fog Lights Front": true,
        "Radio": true,
        "Fog Lights - Rear": false,
        "Cruise Control": true,
        "Automatic Climate Control": false
      };
      return { carOverview, carFeatures, carSpecifications };
    });

  return { carOverview, carFeatures, carSpecifications };
}

module.exports = CarDetails;
