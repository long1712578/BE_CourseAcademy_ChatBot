const util = require('util');
const mysql = require('mysql');
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'course_academy',
    port: 3306
  },
  pool: { min: 0, max: 100 }
});
module.exports = {
  knex
}
