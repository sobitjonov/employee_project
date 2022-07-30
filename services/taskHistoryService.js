 
const { findEmployeeRepo } = require('../repository/employee')
const { checkUser } = require('../repository/auth')
const Roles = require('../config/roles');
const TaskStatus = require('../config/taskStatus'); 

// table.integer('action_type').notNullable() // 0-deleted 1-created 2-updated
//         table.integer('action_user_id').notNullable().references('id').inTable('users');
//         table.integer('employee_id').notNullable().references('id').inTable('tasks');
//         table.text('name', 250).notNullable()     
//         table.integer('status').notNullable()// 0-active  1-finished/approvda  2-approve qilindi 
//         table.integer('employee_id').notNullable().references('id').inTable('users');
//         table.timestamp('connected_date'); 
//         table.timestamp('due_date').notNullable();
//         table.timestamp('finished_date');
 


const createNewTask = async (req, res) => {
    try {
        const { name: task_name, employee_id, due_date } = req.body;
        if (!task_name || !due_date || !employee_id ) return res.status(400).json({ 'message': 'Task name, Employee id, due date are required.' }); 
        
        let due_date_timestamp = (new Date(due_date)).getTime(); 
        let valid =  due_date_timestamp> 0;
        if (!valid ) return res.status(400).json({ 'message': 'Invalid due date.' });
        
        let foundEmployee = await findEmployeeRepo(employee_id);  
        if (!foundEmployee) return res.status(400).json({ 'message': `No employee with id ${employee_id}` });
        
        const manager = await checkUser(req.login) // get user id
        const task = await newTaskRepo(task_name, manager.id, employee_id, due_date_timestamp);  
        res.status(201).json({ 'success': `New task ${task.id} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


const updateTask = async (req, res) => {
    try {
        let task = await findTaskRepo(req.body.id);
        if (!task) return res.status(400).json({ "message": `Task ID ${req.body.id} not found` });
        if (task.status == TaskStatus.Approved) return res.status(400).json({ "message": `Task ID ${req.body.id} is finished and approved` });
        
        const user = await checkUser(req.login) // getting the user updating the task
        if (task.manager_id !== user.id) return res.sendStatus(401) // task does not belong to manager
        if (task.employee_id !== user.id) return res.sendStatus(401)  // this employee does not belong
        if (task.status == TaskStatus.Finished) {
            if( Roles.Manager == user.role_id ) {
                if (req.body.status) task.status == req.body.status// manager can only approve task
            } else {
                return res.status(400).json({ "message": `Task ID ${req.body.id} is finished and cannot be updated` });
            }    
        }
        if (task.status == TaskStatus.Active) {  
            if( Roles.Manager == user.role_id ){  
                if (req.body.name) task.name = req.body.name;
                if (req.body.employee_id) task.employee_id = req.body.employee_id;
                if (req.body.due_date) task.due_date = req.body.due_date; 
                if (req.body.status) task.status = req.body.status; // manager can finish or approve task
            } else { //Employee 
                if (req.body.status) task.status = req.body.status; // employee can only finish task
                task.finished_date = new Date;
            }   
        }
        
        //password and role can be more validated
        const updatedTask = await updateTaskRepo(task.id, task.name, task.status, task.employee_id, task.due_date, task.finished_date); 
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


module.exports = { 
    createNewTask,
    updateTask 
}
