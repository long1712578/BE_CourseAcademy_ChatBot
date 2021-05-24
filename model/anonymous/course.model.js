const db = require('../../utils/db');
const moment = require('moment');
module.exports = {
    all() {
        return db('course')
    },
    async mostHighLight() {
        let currentDate = moment();
        let startdate = currentDate.subtract(7, "days");
        const courseMostHighLight = await db
            .select('course.*')
            .from('rating')
            .where('create_at', '>=', new Date(startdate))
            .avg('rating as rat').groupBy('course_id')
            .orderBy('rat', 'desc')
            .limit(4).rightJoin('course', 'rating.course_id', 'course.id')
        return courseMostHighLight;
    },
    mostView() {
        return db('course').orderBy('view', 'desc').limit(10)
    },
    newCourse() {
        return db('course').orderBy('last_update', 'desc').limit(10)
    },
    async mostRegis() {
        let currentDate = moment();
        let startDate = currentDate.subtract(7, "days");
        const courseMostRegis = await db
        (
            db.select('category.id as category_id')
                .from('course_order')
                .where('enroll_at', '>=', new Date(startDate))
                .count('course_id as number').groupBy('course_id')
                .rightJoin('course', 'course_order.course_id', 'course.id')
                .rightJoin('category', 'course.category_id', 'category.id')
                .groupBy('category.id').as('t1'))
            .select('t1.category_id')
            .groupBy('t1.category_id').sum('t1.number as tNumber').orderBy('tNumber', 'desc')

        return courseMostRegis;
    },
    async informationCourse(id) {
        const inforCourse = await db.select('*').from('course').where('id', id)
        return inforCourse;
    },
    async mostBuySameCategory(id) {
        const sameCateInfor = await db(
            db.select('course_2.*')
                .from('course as course_1')
                .where('course_1.id', id)
                .rightJoin('course as course_2', 'course_1.category_id', 'course_2.category_id')
                .whereNot('course_2.id', id).as('t1'))
                .select('t1.*')
                .leftJoin('course_order','t1.id','course_order.course_id')
                .count('t1.id as countEnroll')
                .groupBy('t1.id')
                .orderBy('countEnroll','desc').limit(5);
            // .select('course_order.course_id')
            // .from('course_order')
            // .where('course_order.course_id', 't1.id')
            // .count('course_id as number').groupBy('course_id')
        ;

        return sameCateInfor;
    }
}