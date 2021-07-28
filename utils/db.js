const util = require('util');
const mysql = require('mysql');
const knex = require('knex')({
  client: 'mysql2',
  // connection: {
  //   host: 'localhost',
  //   user: 'root',
  //   password: 'mysql',
  //   database: 'course_academy',
  //   port: 3306
  // },
  connection: {
    // host: 'remotemysql.com',
    // user: 'vO0WORyO3w',
    // password: 'ZQDtk88dCQ',
    // database: 'vO0WORyO3w',
    host: '127.0.0.1',
    user: 'root',
    password: 'huynh012',
    database: 'course_academy',
    port: 3306
  },
  pool: { min: 0, max: 100 }
});
module.exports = {
  knex
}
