const db = require('../services/knex')


const getManagerTasks = async (pLogin) => {
    const user = await db('users')
        .where('login', pLogin)
        .select('id')
        .first()  

    const tasks = await db('tasks') 
        .where('manager_id', user.id)
        .select()  
    return tasks;
}


const getEmployeeTasks = async (pLogin) => {
    const user = await db('users')
        .where('login', pLogin)
        .select('id')
        .first()

    const tasks = await db('tasks') 
        .where('employee_id', user.id)
        .select() 
    return tasks;
}


const newTask = async (name, manager_id, employee_id ) => { 
    const [id] = await db('tasks')
        .insert({
            name:           name,
            status:         false,
            manager_id:     manager_id,
            employee_id:    employee_id,
            connected_date: employee_id ? new Date() : null   
        })
        .returning('id')

    return id;
}


const findTask = async (pId) => {
    const task = await db('tasks')
        .where('id', pId)
        .select()
        .first()
    return task;
}


const updateTask = async (id, name, status, employee_id, due_date ) => {
    const count = await db('tasks')
        .where('id', id)
        .update({
            name:        name,
            status:      status,
            employee_id: employee_id,
            due_date:    due_date  
        })
        .returning('id')

    return count;
}


const deleteTask = async (task_id, manager_id) => {
    await db("tasks")
        .where({
            id: task_id,
            manager_id: manager_id
          })
        .del();
}


const deletManagerTasks = async (pId) => {
    await db("tasks")
        .where('manager_id', pId)
        .del(); 
}

const deleteEmployeeFromTasks = async (id) => {
    const count = await db('tasks')
        .where('employee_id', id)
        .update({ 
            employee_id: null
        })
        .returning('id')

    return count;
}


module.exports.getManagerTasksRepo = getManagerTasks;
module.exports.getEmployeeTasksRepo = getEmployeeTasks;   
module.exports.newTaskRepo = newTask;
module.exports.findTaskRepo = findTask; 
module.exports.updateTaskRepo = updateTask;
module.exports.deleteTaskRepo = deleteTask;
module.exports.deletManagerTasksRepo = deletManagerTasks;
module.exports.deleteEmployeeFromTasksRepo = deleteEmployeeFromTasks;