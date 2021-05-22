const util = require('util');
const mysql = require('mysql');
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: 'remotemysql.com',
    user: 'vO0WORyO3w',
    password: 'ZQDtk88dCQ',
    database: 'vO0WORyO3w',
    port: 3306
  },
  pool: { min: 0, max: 50 }
});
  //Tao ket noi voi database
function createConnection() {
  return mysql.createPool({
      host: 'remotemysql.com',
      port: '3306',
      user: 'vO0WORyO3w',
      password: 'ZQDtk88dCQ',
      database: 'vO0WORyO3w',
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