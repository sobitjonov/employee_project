const db = require('../db/knex')
const TaskStatus = require('../config/taskStatus'); 
 
const getManagerTasks = async (pId, sortBy, sortDirection, page, limit) => { 
    const tasks = await db('tasks') 
        .where('manager_id', pId)
        .orderBy(sortBy, sortDirection)
        .limit(limit)
        .offset((page - 1) * limit) 
        .select()  
    return tasks;
}


const getEmployeeTasks = async (pId, sortBy, sortDirection, page, limit) => { 
    const tasks = await db('tasks') 
        .where('employee_id', pId)
        .orderBy(sortBy, sortDirection)
        .limit(limit)
        .offset((page - 1) * limit) 
        .select() 
    return tasks;
}


const newTask = async (name, manager_id, employee_id, due_date) => { 
    const newTask = await db('tasks')
        .insert({
            name:           name,
            status:         TaskStatus.Active,
            manager_id:     manager_id,
            employee_id:    employee_id,
            due_date,       due_date, 
            connected_date: employee_id ? new Date() : null   
        })
        .returning(['id', 'name','status', 'manager_id', 'employee_id', 'connected_date', 'due_date', 'finished_date'])
    
    return newTask;
}


const findTask = async (pId) => {
    const task = await db('tasks')
        .where('id', pId)
        .select()
        .first()
    return task;
}


const updateTask = async (id, name, status, employee_id, due_date, finished_date ) => {
    const count = await db('tasks')
        .where('id', id)
        .update({
            name:          name,
            status:        status,
            employee_id:   employee_id,
            due_date:      due_date,
            finished_date: finished_date  
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

const getLateTasks = async () => { 
    const tasks = await db('tasks')  
        .whereRaw("?? < ??", ["due_date", "finished_date"])
        .select()  
    return tasks;
}


module.exports.getManagerTasksRepo = getManagerTasks;
module.exports.getEmployeeTasksRepo = getEmployeeTasks;   
module.exports.newTaskRepo = newTask;
module.exports.findTaskRepo = findTask; 
module.exports.updateTaskRepo = updateTask;
module.exports.deleteTaskRepo = deleteTask;
module.exports.deletManagerTasksRepo = deletManagerTasks;
module.exports.deleteEmployeeFromTasksRepo = deleteEmployeeFromTasks;
module.exports.getLateTasksRepo = getLateTasks;