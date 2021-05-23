const db = require('../utils/db');
const moment = require('moment');
const tbField = 'course_field';

module.exports = {
    add(course_field){
        return db.knex(tbField).insert(course_field);
    },
    async delete(id){
        return await db.knex(tbField).where('id', id).delete();
    },
    async update(id, field){
        await db.knex(tbField).where('id', id).update(field);
    },
    async single(id){
        const field = await db.knex(tbField).where('id', id);
        if(field.length === 0){
            return null;
        }
        return field[0];
    }
}