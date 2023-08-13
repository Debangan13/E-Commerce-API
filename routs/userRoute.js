const express = require('express')
const router = express.Router()
const {authenticateUser,authorizePermissions} = require('../middleware/authentication')

const {
    getAllUsers,
	getSingleUsers,
	showCurrentUsers,
	updateUsers,
	updateUserPassword,
} = require('../controller/userController')

router.route('/').get(authenticateUser,authorizePermissions('admin','owner'),getAllUsers)

router.route('/showMe').get(authenticateUser, showCurrentUsers)
router.route('/updateUser').patch(authenticateUser,updateUsers)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)

router.route('/:id').get(authenticateUser,getSingleUsers)

module.exports = router