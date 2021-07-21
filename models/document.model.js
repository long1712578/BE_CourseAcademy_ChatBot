const db = require('../utils/db');

module.exports = {
    async all() {
        // 
        return await db.knex('document').leftJoin("course", "document.course_id", "course.id").select('*')
            .options({ nestTables: true });
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