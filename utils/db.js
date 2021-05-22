const util = require('util');
const mysql = require('mysql');
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'course_academy',
    port: 3306
  },
  pool: { min: 0, max: 50 }
});
  //Tao ket noi voi database
function createConnection() {
  return mysql.createPool({
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: '',
      database: 'course_academy',
      connectionLimit: 50,
  });
}
const pool=createConnection();

const pool_query = util.promisify(pool.query).bind(pool);

module.exports={
  knex,
  load: sql => pool_query(sql),
  add: (entity, tableName) => pool_query(`insert into ${tableName} set ?`, entity),
  del: (condition, tableName) => pool_query(`delete from ${tableName} where ${condition}`,),
  patch: (entity, condition, tableName) => pool_query(`update ${tableName} set  ${entity} where ${condition}`)
}