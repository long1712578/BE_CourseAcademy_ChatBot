const db = require('../../utils/db');
const moment = require('moment');
module.exports = {
    all() {
        return db.knex('course')
    },
    //view home/dashboard
    async mostHighLight() {
        let currentDate = moment();
        let startDate = currentDate.subtract(7, "days");
        return db.knex
        (db.knex.select('course.*',)
            .from('rating')
            .where('create_at', '>=', new Date(startDate))
            .avg('rating as rat').groupBy('course_id')
            .orderBy('rat', 'desc')
            .limit(4).rightJoin('course', 'rating.course_id', 'course.id').as('t1'))
            .select('*','rat').where('t1.is_delete', 0);
    },
    mostView() {
        return db.knex('course').orderBy('view', 'desc').limit(10)
    },
    newCourse() {
        return db.knex('course').orderBy('last_update', 'desc').limit(10)
    },
    async mostRegis() {
        let currentDate = moment();
        let startDate = currentDate.subtract(7, "days");
        return db.knex
        (
            db.knex.select('category.id as category_id')
                .from('course_order')
                .where('enroll_at', '>=', new Date(startDate))
                .count('course_id as number').groupBy('course_id')
                .rightJoin('course', 'course_order.course_id', 'course.id')
                .where('course.is_delete', 0)
                .rightJoin('category', 'course.category_id', 'category.id')
                .groupBy('category.id').as('t1'))
            .select('t1.category_id','category.name')
            .groupBy('t1.category_id').sum('t1.number as tNumber').orderBy('tNumber', 'desc')
            .leftJoin('category','category.id','category_id');
    },

    //see information
    async informationCourse(id) {
        const course=await db.knex.select('*')
            .from('course')
            .where('id', id)
            .andWhere('is_delete', 0);
        const countRate=await db.knex.select('*')
            .from('rating')
            .where('course_id',id);
        const mostBuySameCategory=await db.knex(
            db.knex.select('course_2.*')
                .from('course as course_1')
                .where('course_1.id', id)
                .andWhere('course_1.is_delete', '0')
                .rightJoin('course as course_2', 'course_1.category_id', 'course_2.category_id')
                .where('course_2.is_delete', '0')
                .whereNot('course_2.id', id).as('t1'))
            .select('t1.*')
            .leftJoin('course_order', 't1.id', 'course_order.course_id')
            .count('t1.id as countEnroll')
            .groupBy('t1.id')
            .orderBy('countEnroll', 'desc').limit(5);
        const teacher=await db.knex.select('user.*')
            .from('course')
            .where('course.id', id)
            .andWhere('course.is_delete', '0')
            .rightJoin('user', 'course.created_by', 'user.id');
        const listFeedback=await db.knex.select('user_id', 'comment').from('rating').where('course_id', id);
        return{
            course,
            countRate,
            mostBuySameCategory,
            teacher,
            listFeedback
        }
    },
}