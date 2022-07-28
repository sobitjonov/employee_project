const bcrypt = require('bcrypt');

const { getEmployeesRepo, newEmployeeRepo, findEmployeeRepo, updateEmployeeRepo, deleteEmployeeRepo} = require('../repository/employee')
const { deletManagerTasksRepo, deleteEmployeeFromTasksRepo } = require('../repository/task')
const { checkUser } = require('../repository/auth')

const Roles = require('../config/roles')


const getAllEmployees = async (req, res) => {
    const users = await getEmployeesRepo()
    res.json(users);
}


const createNewEmployee = async (req, res) => {
    const { fullname, login, password, role_id } = req.body;
    if (!fullname || !login || !password || !role_id) 
        return res.status(400).json({ 'message': 'Fullname, login, password, role are required.' });
    // check for duplicate login in the db 
    const duplicate = await checkUser(login);;
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);  
        const user = await newEmployeeRepo(fullname, login, hashedPwd, role_id);  
        res.status(201).json({ 'success': `New user ${user.id} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


const updateEmployee = async (req, res) => {
    try {
        const employee = await findEmployeeRepo(req.body.id);
        if (!employee) {
            return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
        }
        if (req.body.fullname) employee.fullname = req.body.fullname;
        if (req.body.login) employee.login = req.body.login;
        if (req.body.role_id) employee.role_id = req.body.role_id;
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        //password and role can be more validated
        const user = await updateEmployeeRepo(employee.id, employee.fullname, employee.login, hashedPwd, employee.role_id); 
        res.json(user);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


const deleteEmployee = async (req, res) => {
    const employee = await findEmployeeRepo(req.body.id);;
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    // delete their tasks   
    if( Roles.Manager == employee.role_id ){
        await deletManagerTasksRepo(employee.id)
    } else {
        await deleteEmployeeFromTasksRepo(employee.id)
    } 
    await deleteEmployeeRepo(employee.id);
    const users = await getEmployeesRepo()
    res.json(users); 
}


const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
    }
    res.json(employee);
}


module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}