const db = require('../utils/db');

module.exports = {
    // add user in db
    add(user) {
        return db('user').insert(user);
      },
      //Get user by username
      async singleByUserName(username) {
        const users = await db('user').where('username', username);
        if (users.length === 0) {
          return null;
        }
    
        return users[0];
      },
    // update refeshtoken
      patchRFToken(id, rfToken) {
        return db('user').where('id', id).update('rfToken', rfToken);
      },
    //Check value of refeshtoken
      async isValidRFToken(id, rfToken) {
        const list = await db('users').where('id', id).andWhere('rfToken', rfToken);
        if (list.length > 0) {
          return true;
        }
    
        return false;
      }
}