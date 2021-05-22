const db = require('../utils/db');
const moment = require('moment');
const tbCategory = 'category';
const courseModel = require('../models/course.model');

module.exports = {
    add(category){
        return db.knex(tbCategory).insert(category);
    },
    async delete(id){
        var courses = await courseModel.getCoursesByCategoryId(id);
        if(courses.length === 0){
            return await db.knex(tbCategory).where('id', id).delete();
        }else{
            for (let course of courses){
                courseModel.delete(course.id);
            };
            return await db.knex(tbCategory).where('id', id).delete();
        }
    },
    async update(id, name){
        const category = await db.knex(tbCategory).where('id', id);
        if(category.length === 0){
            return null;
        }
        var last_update = moment().format('YYYY-MM-DD HH:mm:ss');
        await db.patch(`name = '${name}', last_update = '${last_update}'`, `id = ${id}`, tbCategory);
    },
    async single(id){
        const sql = `select * from ${tbCategory} where id =${id}`;
        const category =await db.load(sql);
        console.log('single', category);
        if(category.length === 0){
            return null;
        }
        return category[0];
    }
}