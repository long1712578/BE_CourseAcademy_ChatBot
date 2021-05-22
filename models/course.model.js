const db = require('../utils/db');
const tbCourse = 'course';

module.exports = {
    async getCoursesByCategoryId(categoryId){
        var courses = db.knex(tbCourse).where({'category_id': categoryId, 'is_delete': true});
        return courses;
    },
    async getCoursesByFieldId(fieldId){
        var courses = db.knex(tbCourse).where({'field_id': fieldId, 'is_delete': true});
        return courses;
    },
    delete(id){
        return db.patch('is_delete = false', `id = ${id}`, tbCourse);  
    }
}