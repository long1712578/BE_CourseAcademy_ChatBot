const db = require('../utils/db');

module.exports = {
    async all(filter) {
        const {
            page = 1,
            limit = 6,
            sort_by = "id",
            sort_type = "asc",
            search = "",
            ...otherParams
        } = filter;

        return await db.knex('document').leftJoin("course", "document.course_id", "course.id").where({ ...otherParams }).select('*')
            .options({ nestTables: true });
    },
    async preview(course_id) {
        return await db.knex('document').where({course_id});
    },
    async add(data) {
        return await db.knex('document').insert(data);
    },
    async single(id) {
        const course = await db.knex('document').where({ id: id });
        if (course.length === 0) {
            return null;
        }
        return course[0];
    },
    update(id, data) {
        return db.knex('document').where({ id: id }).update(data);
    },
    delete(id) {
        return db.knex('document').where("id", id).delete();
    },
}