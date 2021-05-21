const db = require('../utils/db');
const tbOrder = 'order_course';
const tbUser = 'user';
module.exports = {
    // Get user had register
    async getAllRegisteredUsers() {
        const sql =`SELECT *  FROM
        (SELECT DISTINCT o.user_id
                FROM ${tbOrder} as o) as ou
        LEFT JOIN ${tbUser} as u
        ON ou.user_id = u.id
        WHERE u.is_delete = true`;
        const tbUserIdOrder = await db.load(sql);
        if (tbUserIdOrder.length === 0){
            return null;
        }
        return tbUserIdOrder;
    }
    // async 

}