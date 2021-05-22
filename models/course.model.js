const { all } = require('../routes/user.route');
const db = require('../utils/db');
const tbCourse = 'course';

module.exports = {
    async all(index, pageSize){
        const courses = await db.knex(tbCourse).where('is_delete', true);
        const totalCourse = courses.length;
        if(totalCourse === 0){
            return null;
        }
        const totalPage=Math.floor(totalCourse/ pageSize)+1;
        const offset=(index-1)*pageSize;
        const rows = await db.knex(tbCourse).limit(pageSize).offset(offset);
        return {
            totalCourse,
            totalPage,
            courses: rows
        };
    },
    async getCoursesByCategoryId(categoryId){
        var courses = db.knex(tbCourse).where({'category_id': categoryId, 'is_delete': true});
        return courses;
    },
    async getCoursesByFieldId(fieldId){
        var courses = db.knex(tbCourse).where({'course_field_id': fieldId, 'is_delete': true});
        return courses;
    },
    delete(id){
        return db.patch('is_delete = false', `id = ${id}`, tbCourse);  
    }
}