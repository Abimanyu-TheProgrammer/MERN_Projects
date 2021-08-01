const express = require('express')
const { requiresSignin, userMiddleware} = require('../common_middleware')
const { addItems } = require('../controllers/cart')
const router = express.Router()


router.post('/user/cart/add', requiresSignin, userMiddleware, addItems)

module.exports = router