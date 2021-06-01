const db = require('../utils/db');

module.exports = {
    add(data) {
        return db.knex('video').insert(data);
    },
    async single(id) {
        const course = await db.knex('video').where({ 'is_delete': false, 'id': id });
        if (course.length === 0) {
            return null;
        }
        return course[0];
    },
    delete(id) {
        return db.knex('video').where('id', id).update('is_delete', true);
    },
}