const express = require('express');
const router = express.Router();
const tasksController = require('../../controllers/taskController');
const Roles = require('../../config/roles')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .get(verifyRoles(Roles.Manager, Roles.Employee), tasksController.getAllTasks)
    .post(verifyRoles(Roles.Manager, Roles.Employee), tasksController.createNewTask)
    .put(verifyRoles(Roles.Manager, Roles.Employee), tasksController.updateTask)
    .delete(verifyRoles(Roles.Manager), tasksController.deleteTask);

// router.route('/:id')
//     .get(verifyRoles(Roles.Admin, Roles.Manager), employeesController.getEmployee);

module.exports = router;