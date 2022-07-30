const db = require('../db/knex')


const getEmployees = async (sortBy, sortDirection, page, limit) => {
    const users = await db('users')
        .orderBy(sortBy, sortDirection)
        .limit(limit)
        .offset((page - 1) * limit)  
    return users;
}


const findEmployee = async (pId) => {
    const user = await db('users')
        .where('id', pId)
        .select()
        .first()
    return user;
}


const newEmployee = async (fullname, login, password, role_id ) => {
    const [id] = await db('users')
        .insert({
            fullname: fullname,
            login:    login,
            password: password, 
            role_id:  role_id 
        })
        .returning('id')

    return id;
}


const updateEmployee = async (id, fullname, login, password, role_id ) => {
    const count = await db('users')
        .where('id', id)
        .update({
            fullname: fullname,
            login:    login,
            password: password, 
            role_id:  role_id 
        })
        .returning('id')

    return count;
}

 
const deleteEmployee = async (pId) => {
    await db("users")
        .where('id', pId)
        .del();
}

module.exports.getEmployeesRepo = getEmployees; 
module.exports.findEmployeeRepo = findEmployee;
module.exports.newEmployeeRepo = newEmployee;
module.exports.updateEmployeeRepo = updateEmployee;
module.exports.deleteEmployeeRepo = deleteEmployee;