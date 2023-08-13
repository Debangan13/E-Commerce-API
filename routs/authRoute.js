const express = require('express')
const router = express.Router()

const {
    register,
    login,
    logOut
} = require('../controller/authController')

router.post('/register', register)
router.post('/login', login)
router.get('/logOut',logOut)

module.exports = router