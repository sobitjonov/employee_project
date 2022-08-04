const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeesController');
const Roles = require('../../config/roles')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .get(verifyRoles(Roles.Admin, Roles.Manager), employeeController.getAllEmployees)
    .post(verifyRoles(Roles.Admin), employeeController.createNewEmployee)
    .put(verifyRoles(Roles.Admin), employeeController.updateEmployee)
    .delete(verifyRoles(Roles.Admin), employeeController.deleteEmployee);

router.route('/:id')
    .get(verifyRoles(Roles.Admin, Roles.Manager), employeeController.getEmployee);

module.exports = router;