const util = require('util');
const mysql = require('mysql');
const knex = require('knex')({
  client: 'mysql2',
  // connection: {
  //   host: 'localhost',
  //   user: 'root',
  //   password: '',
  //   database: 'course_academy',
  //   port: 3306
  // },
  connection: {
    host: 'sql12.freesqldatabase.com',
    user: 'sql12619811',
    password: 'pgNVbcH1Dl',
    database: 'sql12619811',
    // host: '127.0.0.1',
    // user: 'root',
    // password: '',
    // database: 'course_academy',
    // port: 3306
  },
  pool: { min: 0, max: 100 }
});
module.exports = {
  knex
}
