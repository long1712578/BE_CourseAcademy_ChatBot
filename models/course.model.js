const { all } = require('../routes/user.route');
const db = require('../utils/db');
const tbCourse = 'course';

module.exports = {
    async all(index, pageSize, categoryId, teacherId) {
        let courses;
        const offset = (index - 1) * pageSize;
        let rows;
        if (categoryId === null && teacherId === null) {
            courses = await db.knex(tbCourse).where('is_delete', true);
            rows = await db.knex(tbCourse).where('is_delete', true).limit(pageSize).offset(offset);
        }
        if (categoryId !== null && teacherId === null) {
            courses = await db.knex(tbCourse).where({ 'is_delete': true, 'category_id': categoryId });
            rows = await db.knex(tbCourse).where({ 'is_delete': true, 'category_id': categoryId }).limit(pageSize).offset(offset);
        }
        if (categoryId === null && teacherId !== null) {
            courses = await db.knex(tbCourse).where({ 'is_delete': true, 'created_by': teacherId });
            rows = await db.knex(tbCourse).where({ 'is_delete': true, 'created_by': teacherId }).limit(pageSize).offset(offset);
        }
        if (categoryId !== null && teacherId !== null) {
            courses = await db.knex(tbCourse).where({ 'is_delete': true, 'category_id': categoryId, 'created_by': teacherId });
            rows = await db.knex(tbCourse).where({ 'is_delete': true, 'category_id': categoryId, 'created_by': teacherId }).limit(pageSize).offset(offset);
        }
        const totalCourse = courses.length;
        if (totalCourse === 0) {
            return null;
        }
        const totalPage = Math.floor(totalCourse / pageSize) + 1;
        return {
            totalCourse,
            totalPage,
            courses: rows
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