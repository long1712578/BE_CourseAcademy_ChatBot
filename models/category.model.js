const db = require('../utils/db');
const moment = require('moment');
const tbCategory = 'category';

module.exports = {
    async all() {
       // const { limit = 999 } = filter;
        return await db.knex('category');
    },
    async getCategoryByFieldId (id){
        return await db.knex('category').where('field_id', id);
    },
    async add(category) {
        return await db.knex(tbCategory).insert(category);
    },
    async delete(id) {
        return await db.knex(tbCategory).where('id', id).delete();
    },
    async update(id, name) {
        const category = await db.knex(tbCategory).where('id', id);
        if (category.length === 0) {
            return null;
        }
        var last_update = moment().format('YYYY-MM-DD HH:mm:ss');
        //await db.patch(`name = '${name}', last_update = '${last_update}'`, `id = ${id}`, tbCategory);
        await db.knex(tbCategory).where('id', id).update({ name: name, last_update: last_update });
    },
    async single(id) {
        const category = await db.knex(tbCategory).where("id", id);
        if (category.length === 0) {
            return null;
        }
        return category[0];
    }
}