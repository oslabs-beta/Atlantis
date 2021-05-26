const { Pool } = require('pg');
require('dotenv').config();

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

module.exports = {
  query: (text: any, params: any, callback: any) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
