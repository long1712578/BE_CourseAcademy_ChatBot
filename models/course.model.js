const { all } = require('../routes/user.route');
const db = require('../utils/db');
const tbCourse = 'course';

module.exports = {
    async all(filter,) {
        const { page = 1, limit = 6, sort_by = "id", sort_type = 'asc', ...otherParams } = filter;
        const offset = (page - 1) * limit;
        const courses = await db.knex(tbCourse).where({ ...otherParams, is_delete: true }).limit(limit).offset(offset).orderBy(sort_by, sort_type);
        const courses1 = await db.knex(tbCourse).where({ ...otherParams, is_delete: true });
        const totalCourse = courses1.length;
        const totalPage = Math.floor(totalCourse / limit) + 1;
        return {
            totalPage,
            courses
        };
    },
    async getCoursesByCategoryId(categoryId) {
        var courses = db.knex(tbCourse).where({ 'category_id': categoryId, 'is_delete': true });
        return courses;
    },
    async getCoursesByFieldId(fieldId) {
        var courses = db.knex(tbCourse).where({ 'course_field_id': fieldId, 'is_delete': true });
        return courses;
    },
    async single(id) {
        const course = await db.knex(tbCourse).where({ 'is_delete': true, 'id': id });
        if (course.length === 0) {
            return null;
        }
        return course[0];
    },
    delete(id) {
        return db.patch('is_delete = false', `id = ${id}`, tbCourse);
    },
    add(course) {
        return db.add(tbCourse, course);
    },
    update(id, data) {
        return db.patch(course, `{is_delete = false, id = ${id}`, tbCourse); py
    }
}