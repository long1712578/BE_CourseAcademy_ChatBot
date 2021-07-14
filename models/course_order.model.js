const db = require("../utils/db");

module.exports = {
    async all(filter) {
        const {
            page = 1,
            limit = 6,
            sort_by = "course_order.id",
            sort_type = "asc",
            search = "",
            ...otherParams
        } = filter;
        const offset = (page - 1) * limit;
        const model = db
            .knex("course_order")
            .leftJoin("user", "course_order.user_id", "user.id")
            .leftJoin("course", "course_order.course_id", "course.id")
            .where({ ...otherParams })

        const totalCourseOrder = await model.clone().count();
        const courseOrders = await model
            .clone()
            .offset(offset)
            .limit(limit)
            .orderBy(sort_by, sort_type)
            .select("*")
            .options({ nestTables: true });
        const totalPage = Math.floor(totalCourseOrder[0]["count(*)"] / limit) + 1;
        return {
            totalPage,
            length: courseOrders.length,
            courseOrders,
        };
    },
    async single(id) {
        const course = await db.knex('course_order').where({ id: id });
        if (course.length === 0) {
            return null;
        }
        return course[0];
    },
    delete(id) {
        return db.knex('course_order').where("id", id).delete();
    },
    add(order) {
        return db.knex('course_order').insert(order);
    },
    update(id, data) {
        return db.knex('course_order').where({ id }).update(data);
    },
    save(data) {
        return db.knex('course_order').save(data);
    },
};
