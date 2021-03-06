const db = require('../utils/db');

module.exports = {
    async all(filter) {
        const {
            page = 1,
            limit = 6,
            sort_by = "user.id",
            sort_type = "asc",
            search = "",
            ...otherParams
        } = filter;
        const offset = (page - 1) * limit;
        const model = db
            .knex("user")
            .leftJoin("role", "role.id", "user.role_id")
            .where({ ...otherParams });

        const totalUser = await model.clone().count();
        const users = await model
            .clone()
            .offset(offset)
            .limit(limit)
            .orderBy(sort_by, sort_type)
            .select("*")
            .options({ nestTables: true });
        const totalPage = Math.ceil(totalUser[0]["count(*)"] / limit);
        return {
            totalPage,
            length: users.length,
            users,
        };
    },
    // add user in db
    add(user) {
        return db.knex('user').insert(user);
    },
    // delete user
    async delete(id) {
        return db.knex('user').where('id', id).update('is_delete', true);
    },
    //Get user by username
    async singleByUserName(username) {
        // const users = await db.knex('user').where('username', username);
        const users = await db.knex('user').where({username, is_delete: false, active: true});
        if (users.length === 0) {
            return null;
        }

        return users[0];
    },
    async singleById(id) {
        const user = await db.knex('user').where('id', id);
        if (user.length === 0) {
            return null;
        }

        return user[0];
    },
    //Get teacher
    async getAllTeacher() {
        const teachers = await db.knex('user').where({ 'role_id': 2, 'is_delete': false });
        if (teachers.length === 0) {
            return null;
        }
        return teachers;
    },
    // Get all email of user
    async getEmailAll(){
        const emails = await db.knex.select('email')
                                    .from('user')
                                    .where('is_delete', 0)
        if (emails.length === 0) {
            return null;
        }
        return emails;
    },
    async getEmaiById(id){
        const emails = await db.knex.select('email')
                                    .from('user')
                                    .where('id', id)
        if (emails.length === 0) {
            return null;
        }
        return emails[0];
    },
    //Get teacher by id
    async getTeacherById(id) {
        const teacher = await db.knex('user').where({ 'id': id, 'role_id': 2, 'is_delete': false });
        if (teacher.length === 0) {
            return null;
        }
        return teacher[0];
    },
    // update refeshtoken
    patchRFToken(id, rfToken) {
        return db.knex('user').where('id', id).update('rfToken', rfToken);
    },
    //Check value of refeshtoken
    async isValidRFToken(id, rfToken) {
        const list = await db.knex('user').where('id', id).andWhere('rfToken', rfToken);
        if (list.length > 0) {
            return true;
        }

        return false;
    },
    async update(id, data) {
        if (data.username !== undefined) {
            const user = await knex('user').where({ username: data.username });
            if (user) {
                return null;
            }
        }
        return db.knex('user').where('id', id).update(data);
    },

    async updateOpt(email){
        return db.knex('user').where('email', email).update({active: true});
    },
    getInforUser(userId) {
        return db.knex.select('fullname', 'username', 'address', 'email', 'phone', 'gender', 'date_of_birth', 'avatar', 'role_id')
            .from('user')
            .where('id', userId)
            .andWhere('is_delete', 0)
    },

    watchList(idUser) {
        return db.knex.select('course.*')
            .from('like')
            .where('user_id', idUser)
            .rightJoin('course', 'course.id', 'like.course_id');
    },

    async updateUser(idUser, data) {
        return db.knex('user')
            .where('id', idUser)
            .update(data);
    },

    unLikeCourse(idUser, idCourse) {
        return db.knex('like')
            .where('user_id', idUser)
            .andWhere('course_id', idCourse)
            .del();
    },

    likeCourse(idUser, idCourse) {
        return db.knex('like')
            .insert({
                'user_id': idUser,
                'course_id': idCourse
            });
    },

    listCourseEnroll(idUser) {
        return db.knex.select('course.*')
            .from('course_order')
            .where('user_id', idUser)
            .rightJoin('course', 'course.id', 'course_order.course_id');
    },


    regisCourse(idUser, idCourse) {
        return db.knex('course_order')
            .insert({
                'user_id': idUser,
                'course_id': idCourse,
                'enroll_at': new Date()
            });
    },

    studyCourse(idUser, idCourse) {
        return db.knex.select('video.*')
            .from('course_order')
            .where('course_order.user_id', idUser)
            .andWhere('course_order.course_id', idCourse)
            .rightJoin('video', 'video.course_id', 'course_order.course_id');
    },

    ratingCourse(idUser, idCourse, comment, rating) {
        return db.knex('rating')
            .insert({
                'user_id': idUser,
                'course_id': idCourse,
                'comment': comment,
                'create_at': new Date(),
                'rating': rating
            });
    },

    isLike(idUser, idCourse) {
        return db.knex('like').where('user_id', idUser).andWhere('course_id', idCourse);
    },

}