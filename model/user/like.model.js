const db = require('../../utils/db');

module.exports = {
    isLike(idUser,idCourse)
    {
        return db('like').where('user_id',idUser).andWhere('course_id',idCourse).andWhere('status',1)
    }
}