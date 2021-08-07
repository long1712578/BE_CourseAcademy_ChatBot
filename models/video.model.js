const db = require('../utils/db');

module.exports = {
    async all() {
        return await db.knex('video').leftJoin("course", "video.course_id", "course.id").select('*')
            .options({ nestTables: true });;
    },
    async add(data) {
        return await db.knex('video').insert(data);
    },
    async preview(course_id) {
        return await db.knex('video').where({course_id});
    },
    async single(id) {
        const course = await db.knex('video').where({ id: id });
        if (course.length === 0) {
            return null;
        }
        return course[0];
    },
    update(id, data) {
        return db.knex('video').where({ id: id }).update(data);
    },
    delete(id) {
        return db.knex('video').where("id", id).delete();
    },
}