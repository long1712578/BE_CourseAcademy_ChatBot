const db = require("../utils/db");

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
        const offset = (page - 1) * limit;
        const model = db
            .knex("course_order")
            .where({ ...otherParams })

        const totalCourseOrder = await model.clone().count();
        const courseOrders = await model
            .clone()
            .offset(offset)
            .limit(limit)
            .select("course_order.*");
        const totalPage = Math.floor(totalCourseOrder[0]["count(*)"] / limit) + 1;
        return {
            totalPage,
            length: courseOrders.length,
            courseOrders,
        };
    },
};
