const db = require('../../utils/db');

module.exports={
    getInforUser(userId)
    {
        return db.select('fullname','username','address','email','phone','gender','date_of_birth','avatar','role_id')
            .from('user')
            .where('id',userId)
           .andWhere('is_delete',0)
    },
    watchList(idUser)
    {
        return db.select('course.*')
            .from('like')
            .where('user_id',idUser)
            .rightJoin('course','course.id','like.course_id');
    },
    async updateUser(idUser,data)
    {
        return db('user')
            .where('id',idUser)
            .update(data);
    },
    unLikeCourse(idUser,idCourse) {
        return db('like')
            .where('user_id',idUser)
            .andWhere('course_id',idCourse)
            .del();
    },

    likeCourse(idUser,idCourse)
    {
        return db('like')
            .insert({
                'user_id':idUser,
                'course_id':idCourse
            });
    },

    listCourseEnroll(idUser)
    {
        return db.select('course.*')
            .from('course_order')
            .where('user_id',idUser)
            .rightJoin('course','course.id','course_order.course_id');
    },


    regisCourse(idUser,idCourse)
    {
        return db('course_order')
            .insert({
                'user_id':idUser,
                'course_id':idCourse,
                'enroll_at': new Date()
            });
    },

    studyCourse(idUser,idCourse)
    {
        return db.select('video.*')
                .from('course_order')
                .where('course_order.user_id',idUser)
                .andWhere('course_order.course_id',idCourse)
                .rightJoin('video','video.course_id','course_order.course_id');
    },

    ratingCourse(idUser,idCourse,comment,rating)
    {
        return db('rating')
                .insert({
                    'user_id':idUser,
                    'course_id':idCourse,
                    'comment':comment,
                    'create_at':new Date(),
                    'rating':rating});
    }

}