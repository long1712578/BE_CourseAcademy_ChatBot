const db = require("../utils/db");
const tbCourse = "course";

module.exports = {
    async all(filter) {
        const {
            page = 1,
            limit = 6,
            sort_by = "course.id",
            sort_type = "asc",
            search = "",
            ...otherParams
        } = filter;
        const offset = (page - 1) * limit;
        const model = db
            .knex("course")
            .leftJoin("category", "course.category_id", "category.id")
            .leftJoin("user","course.created_by","user.id")
            .where({ ...otherParams, "course.is_delete": false })
            .orderBy(`course.${sort_by}`, sort_type)
            .where((qb) => {
                search
                    ? qb
                        .andWhereRaw("MATCH(course.name) AGAINST(?)", search)
                        .orWhereRaw("MATCH(category.name) AGAINST(?)", search)
                    : {};
            })

        const totalCourse = await model.clone().count();
        const courses = await model
            .clone()
            .offset(offset)
            .limit(limit)
            .orderBy(sort_by, sort_type)
            .select('*')
            .options({ nestTables: true });
        const totalPage = Math.floor(totalCourse[0]["count(*)"] / limit) + 1;
        return {
            totalPage,
            length: courses.length,
            courses
        };
    },
    async getCoursesByCategoryId(categoryId) {
        var courses = db.knex(tbCourse).where({ 'category_id': categoryId, 'is_delete': false });
        return courses;
    },
    async getCoursesByFieldId(fieldId) {
        var courses = db.knex(tbCourse).where({ 'course_field_id': fieldId, 'is_delete': false });
        return courses;
    },
    async single(id) {
        const course = await db.knex(tbCourse).where({ 'is_delete': false, 'id': id });
        if (course.length === 0) {
            return null;
        }
        return course[0];
    },
    delete(id) {
        return db.knex(tbCourse).where("id", id).update("is_delete", true);
    },
    add(course) {
        return db.knex(tbCourse).insert(course);
    },
    update(id, data) {
        return db.knex(tbCourse).where({ id, is_delete: false }).update(data);
    },
    save(data) {
        return db.knex(tbCourse).save(data);
    },
};
