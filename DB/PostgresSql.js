const postgres = require('postgres');

const { DATABASE_URL } = process.env;

const sql = postgres(DATABASE_URL, { ssl: 'require' });

module.exports = sql;