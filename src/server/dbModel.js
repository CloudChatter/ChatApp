const { Pool } = require('pg');

const PG_URI = 'postgres://fqlrmqdw:Q-czBq4XKLQlDYUFYbDeq2oE8uFTfCmK@drona.db.elephantsql.com:5432/fqlrmqdw';

// create a new pool here using the connection string above
const pool = new Pool({
	connectionString: PG_URI,
});


module.exports = {
	query: (text, params, callback) => {
		console.log('executed query', text);
		return pool.query(text, params, callback);
	}
};