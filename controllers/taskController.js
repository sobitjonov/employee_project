const bcrypt = require('bcrypt');

const { getManagerTasksRepo, getEmployeeTasksRepo, newTaskRepo, findTaskRepo, updateTaskRepo, deleteTaskRepo, getLateTasksRepo } = require('../repository/task')
const { findEmployeeRepo } = require('../repository/employee')
const {newTaskHistoryRepo} = require('../repository/taskHistory')
const { checkUser } = require('../repository/auth')
const Roles = require('../config/roles');
const TaskAction = require('../config/taskActionType')
const TaskStatus = require('../config/taskStatus'); 


const getAllTasks = async (req, res) => {
    try {
        let tasks; 
        const { role:userRole, login:userLogin, query: filters } = req; 
               
        const sortColumn = filters.sort || 'created_at'; 
        const sortDirection = filters.direction || 'desc';
        const page = filters.page || 1;
        const limit = filters.limit || 10;
 
        const user = await checkUser(userLogin) // get user id
        if( Roles.Manager == userRole ) {
            tasks = await getManagerTasksRepo(user.id, sortColumn, sortDirection, page, limit)
        } else {
            tasks = await getEmployeeTasksRepo(user.id, sortColumn, sortDirection, page, limit)
        } 
        res.json(tasks); 
    } catch (err) {
        res.    status(500).json({ 'message': err.message });
    }       
}


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
        let task = await newTaskRepo(task_name, manager.id, employee_id, new Date(due_date));   
        task = task[0]
        console.log(task)
        const taskHistory = await newTaskHistoryRepo(TaskAction.Created, manager.id, task.id, task.name, task.status, task.manager_id, task.employee_id, task.connected_date, task.due_date, task.finished_date)
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


const deleteTask = async (req, res) => {
    try {
        const user = await checkUser(req.login)
        const task = await findTaskRepo(req.body.id);
        if (!task) return res.status(400).json({ "message": `Task ID ${req.body.id} not found` });
        if(task.manager_id !== user.id) return res.sendStatus(401)  
        await deleteTaskRepo(task.id, user.id) 
        const tasks = await getManagerTasksRepo(user.login)
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


const getTask = async  (req, res) => {
    try {
        const task = await findTaskRepo(req.params.id);
        if (!task) {
            return res.status(400).json({ "message": `Task ID ${req.params.id} not found` });
        }
        const user = await checkUser(req.login) // getting the user updating the task
        if( Roles.Manager == user.role_id ) {
            if (task.manager_id !== user.id) return res.sendStatus(401) // task does not belong to manager
        } else {
            if (task.employee_id !== user.id) return res.sendStatus(401)  // this employee does not belong
        }  
        
        res.json(task);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    } 
}


//Business Logic Controllers
// 1. Get all the tasks which passed the due date without approved status
const getLateTasks = async  (req, res) => {
    const tasks = await getLateTasksRepo() 
    res.json(tasks);
}

module.exports = {
    getAllTasks,
    createNewTask,
    updateTask,
    deleteTask,
    getTask,
    getLateTasks
}