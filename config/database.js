const { Pool } = require('pg');
const fs = require('fs');
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const sql = fs.readFileSync('./db/schema.sql').toString();

pool.query(sql, (err, res) => {
  if (err) {
    console.error('Error', err);
  } else {
    console.log('Tables created successfully');
  }
});

module.exports = pool;
