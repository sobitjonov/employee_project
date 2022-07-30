const express = require('express');
const router = express.Router();
const tasksController = require('../../controllers/taskController');
const taskHistoryController = require('../../controllers/taskHistoryController');
const Roles = require('../../config/roles')
const verifyRoles = require('../../middleware/verifyRoles');
const { route } = require('./employees');

router.route('/')
    .get(verifyRoles(Roles.Manager, Roles.Employee), tasksController.getAllTasks)
    .post(verifyRoles(Roles.Manager, Roles.Employee), tasksController.createNewTask)
    .put(verifyRoles(Roles.Manager, Roles.Employee), tasksController.updateTask)
    .delete(verifyRoles(Roles.Manager), tasksController.deleteTask);

router.route('/late')
    .get(verifyRoles(Roles.Manager), tasksController.getLateTasks)

router.route('/history')
    .get(verifyRoles(Roles.Manager), taskHistoryController.getAllTaskHistory)

router.route('/:id')
    .get(verifyRoles(Roles.Manager, Roles.Employee), tasksController.getTask);

module.exports = router;