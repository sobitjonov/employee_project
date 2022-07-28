const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
const Roles = require('../../config/roles')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .get(verifyRoles(Roles.Admin, Roles.Manager), employeesController.getAllEmployees)
    .post(verifyRoles(Roles.Admin), employeesController.createNewEmployee)
    .put(verifyRoles(Roles.Admin), employeesController.updateEmployee)
    .delete(verifyRoles(Roles.Admin), employeesController.deleteEmployee);

router.route('/:id')
    .get(verifyRoles(Roles.Admin, Roles.Manager), employeesController.getEmployee);

module.exports = router;