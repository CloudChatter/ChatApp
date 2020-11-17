const { Pool } = require('pg');
require('dotenv').config();

const SQLPath = process.env.PG_URI;

const pool = new Pool({
  connectionString: SQLPath,
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};

// Import this model in a backend controller to query the database.
// import database from './dbModel.js'
// database.query("insert SQL command here")
