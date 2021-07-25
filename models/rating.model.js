const db = require("../utils/db");
const moment = require('moment');
const { add } = require("./user.model");
const tbRate = "rating";

module.exports = {
    // Get user had register
    async getComment(page, courseId) {
        const limit = 3;
        const offset = (page - 1) * limit;

        const comments = db.knex(tbRate)
        .leftJoin('user', "rating.user_id", "user.id")
        .where("rating.course_id", courseId);

        const total = await comments.clone().count();
        const cmd = await comments.clone().offset(offset).select('*').options({ nestTables: true });
        const totalPage = Math.floor(total[0]["count(*)"] / limit) + 1;

        return {
            totalPage,
            length: cmd.length,
            cmd
        }
    },
    // async post comment
    add(comment){
        return db.knex(tbRate).insert(comment);
    },
    single(user_id, course_id){
        const comment = db.knex(tbRate).where({user_id, course_id});
        return comment;
    },
    update(user_id, course_id, rating){
        var last_update = moment().format('YYYY-MM-DD HH:mm:ss');
        return db.knex(tbRate).where({user_id, course_id}).update({ rating, create_at: last_update });
    }

}