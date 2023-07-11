const sql = require('../DB/PostgresSql');

const CarData = {};

// GET ALL CAR DATA
CarData.get = async () => {
    try {
        return await sql`
      SELECT * FROM car_data
    `;
    } catch (error) {
        console.error('Error getting car data:', error);
        throw error;
    }
};

// GET CAR DATA BY ID
CarData.getById = async (id) => {
    try {
        return (await sql`
      SELECT * FROM car_data WHERE id = ${id}
    `)[0];
    } catch (error) {
        console.error('Error getting car data by ID:', error);
        throw error;
    }
};

// GET DISTINCT make_id
CarData.getDistinctMakeIds = async () => {
    try {
        return await sql`
        SELECT DISTINCT make_id FROM car_data
      `;
    } catch (error) {
        console.error('Error fetching distinct make_id:', error);
        throw error;
    }
};

// GET year and name on the basis of make_id
CarData.getYearAndNameByMakeId = async (makeId) => {
    try {
        return await sql`
        SELECT DISTINCT year, name FROM car_data WHERE make_id = ${makeId}
      `;
    } catch (error) {
        console.error('Error fetching year and name on the basis of make_id:', error);
        throw error;
    }
};

// GET trim on the basis of make_id, year, and name
CarData.getTrimByMakeIdYearAndName = async (makeId, year, name) => {
    try {
        return await sql`
        SELECT DISTINCT trim FROM car_data WHERE make_id = ${makeId} AND year = ${year} AND name = ${name}
      `;
    } catch (error) {
        console.error('Error fetching trim on the basis of make_id, year, and name:', error);
        throw error;
    }
};

module.exports = CarData;
