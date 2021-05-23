const db = require('../utils/db');

module.exports = {
    // add user in db
    add(user) {
        return db.knex('user').insert(user);
      },
    // delete user
    delete(id) {
      return db.knex('user').where('id', id).update('is_delete', true);
    },
    //Get user by username
    async singleByUserName(username) {
      const users = await db.knex('user').where('username', username);
      if (users.length === 0) {
        return null;
      }
  
      return users[0];
    },
    //Get teacher
    async getAllTeacher() {
      const teachers = await db.knex('user').where({'role_id': 2, 'is_delete': false});
      if(teachers.length === 0){
        return null;
      }
      return teachers;
    },
    //Get teacher by id
    async getTeacherById(id) {
      const teacher = await db.knex('user').where({'id': id, 'role_id': 2, 'is_delete': false});
      if(teacher.length === 0){
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
      const list = await db.knex('users').where('id', id).andWhere('rfToken', rfToken);
      if (list.length > 0) {
        return true;
      }
  
      return false;
    }
}