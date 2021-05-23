const db = require('../utils/db');
const tbOrder = 'course_order';
const tbUser = 'user';
module.exports = {
    // Get user had register
    async getAllRegisteredUsers() {
        const result = await db.knex.select('user.*').from('course_order').innerJoin('user', 'course_order.user_id', 'user.id').where('user.is_delete', false);
        if (result.length === 0){
            return null;
        }
        return result;
    }
    // async 

}