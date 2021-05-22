const db = require('../utils/db');
const moment = require('moment');
const tbField = 'course_field';
const courseModel = require('../models/course.model');

module.exports = {
    add(course_field){
        return db.knex(tbField).insert(course_field);
    },
    async delete(id){
        var courses = await courseModel.getCoursesByFieldId(id);
        if(courses.length === 0){
            return await db.knex(tbField).where('id', id).delete();
        }else{
            for (let course of courses){
                courseModel.delete(course.id);
            };
            return await db.knex(tbField).where('id', id).delete();
        }
    },
    async update(id, name, image){
        const field = await db.knex(tbField).where('id', id);
        if(field.length === 0){
            return null;
        }
        if( name === null){
            await db.patch(`image ='${image}' `, `id = ${id}`, tbField);
        }else if (image === null){
            await db.patch(`name = '${name}' `, `id = ${id}`, tbField);
        }else{
            await db.patch(`name = '${name}', image ='${image}' `, `id = ${id}`, tbField);
        }
    },
    async single(id){
        const sql = `select * from ${tbField} where id =${id}`;
        const field =await db.load(sql);
        if(field.length === 0){
            return null;
        }
        return field[0];
    }
}