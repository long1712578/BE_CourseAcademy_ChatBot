const db = require('../utils/db');
const moment = require('moment');
const tbCategory = 'category';

module.exports = {
    add(category){
        return db.knex(tbCategory).insert(category);
    },
    async delete(id){
        return await db.knex(tbCategory).where('id', id).delete();
    },
    async update(id, name){
        const category = await db.knex(tbCategory).where('id', id);
        if(category.length === 0){
            return null;
        }
        var last_update = moment().format('YYYY-MM-DD HH:mm:ss');
        await db.knex(tbCategory).where('id', id).update({name: name, last_update: last_update});
    },
    async single(id){
        const category =await db.knex(tbCategory).where("id",id);
        if(category.length === 0){
            return null;
        }
        return category[0];
    }
}