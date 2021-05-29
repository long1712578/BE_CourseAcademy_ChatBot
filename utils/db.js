const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'remotemysql.com',
        user: 'vO0WORyO3w',
        password: 'ZQDtk88dCQ',
        database: 'vO0WORyO3w',
        port: 3306
    },
    pool: { min: 0, max: 100 }
});
module.exports=knex;