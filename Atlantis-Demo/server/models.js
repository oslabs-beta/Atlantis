const { Pool } = require('pg');

const PG_URI = 'postgres://lsxxpbsf:6aeyS5u1nV1xs2eLa9xjdnVvNIqH82dJ@queenie.db.elephantsql.com:5432/lsxxpbsf';

const pool = new Pool({
    connectionString: PG_URI

  });
  pool.connect()
  .then(() => console.log("connected to DB"))
  
  module.exports = {
    query: (text, params, callback) => {
      console.log('executed query', text);
      return pool.query(text, params, callback);
    }
  };
  