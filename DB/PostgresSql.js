const postgres = require('postgres');

const { DATABASE_URL } = process.env;

const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function getCarDetails() {
    const result = await sql`select * FROM Car_Details`;
    console.log(result);
}

// getCarDetails();