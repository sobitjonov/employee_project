const bcrypt = require('bcrypt');

const { getManagerTasksRepo, getEmployeeTasksRepo, newTaskRepo, findTaskRepo, updateTaskRepo, deleteTaskRepo } = require('../repository/task')
const { checkUser } = require('../repository/auth')
const Roles = require('../config/roles');


const getAllTasks = async (req, res) => {
    try {
        const {role:userRole, login:userLogin} = req; 
        let tasks; 
        if( Roles.Manager == userRole ){
            tasks = await getManagerTasksRepo(userLogin)
        } else {
            tasks = await getEmployeeTasksRepo(userLogin)
        } 
        res.json(tasks); 
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


const createNewTask = async (req, res) => {
    try {
        const { name: task_name, employee_id } = req.body;
        if (!task_name ) return res.status(400).json({ 'message': 'Task name is required.' }); 
        const manager = await checkUser(req.login)
        const task = await newTaskRepo(task_name, manager.id, employee_id);  
        res.status(201).json({ 'success': `New task ${task.id} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


const updateTask = async (req, res) => {
    try {
        let task = await findTaskRepo(req.body.id);
        if (!task) {
            return res.status(400).json({ "message": `Task ID ${req.body.id} not found` });
        }
        const user = await checkUser(req.login)
        if( Roles.Manager == user.role_id ){
            if(task.manager_id !== user.id) return res.sendStatus(401) // task does not belong
            if (req.body.name) task.name = req.body.name;
            if (req.body.employee_id) task.employee_id = req.body.employee_id;
        } else {
            if(task.employee_id !== user.id) return res.sendStatus(401)  
        }  
        if (req.body.status){ 
            task.status = req.body.status;
            task.due_date = new Date;
        } 
        //password and role can be more validated
        const updatedTask = await updateTaskRepo(task.id, task.name, task.status, task.employee_id, task.due_date); 
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


const deleteTask = async (req, res) => {
    const user = await checkUser(req.login)
    const task = await findTaskRepo(req.body.id);
    if (!task) return res.status(400).json({ "message": `Task ID ${req.body.id} not found` });
    if(task.manager_id !== user.id) return res.sendStatus(401)  
    await deleteTaskRepo(task.id, user.id) 
    const tasks = await getManagerTasksRepo(user.login)
    res.json(tasks);
}




const getTask = async  (req, res) => {
    const task = await findTaskRepo(req.params.id);
    if (!task) {
        return res.status(400).json({ "message": `Task ID ${req.params.id} not found` });
    }
    res.json(task);
}

module.exports = {
    getAllTasks,
    createNewTask,
    updateTask,
    deleteTask,
    getTask
}