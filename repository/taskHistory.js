const knex = require('knex')
const db = require('../db/knex')

 
const getAllTasksHistory = async (pId, sortBy, sortDirection, page, limit) => { 
    const tasksHistory = await db('task_history') 
        .where('task_id', pId)
        .orderBy(sortBy, sortDirection)
        .limit(limit)
        .offset((page - 1) * limit) 
        .select()  
    return tasksHistory;
}
  

const newTaskHistory = async (action, user_id, task_id, task_name, status, manager_id, employee_id, connected_date, due_date, finished_date) => { 
    const [id] = await db('task_history')
        .insert({
            action_type:      action,
            action_user_id:   user_id,
            task_id:          task_id,
            name:             task_name, 
            status:           status,
            manager_id:       manager_id,
            employee_id:      employee_id,
            connected_date:   connected_date,   
            due_date,         due_date, 
            finished_date:    finished_date
        })
        .returning('id')

    return id;
} 


const updateTaskHistory = async (id, name, status, employee_id, due_date, finished_date ) => {
    // const count = await db('task_history')
    //     .where('id', id)
    //     .update({ 
    //     })
    //     .returning('id')

    return count;
}

 

module.exports.getAllTasksHistoryRepo = getAllTasksHistory; 
module.exports.newTaskHistoryRepo = newTaskHistory; 
module.exports.updateTaskHistoryRepo = updateTaskHistory;  