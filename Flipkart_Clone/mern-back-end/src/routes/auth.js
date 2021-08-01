const express = require('express');
const {check} = require('express-validator')
const { signup, signin} = require('../controllers/auth');
const { isRequestValidated, validateSignUpRequest, validateSignInRequest } = require('../validators/auth');
const router = express.Router()


router.post("/signin", validateSignInRequest, isRequestValidated,signin )
router.post("/signup", validateSignUpRequest, isRequestValidated,signup )
// router.post('/profile', requiresSignin, (req, res) => {
//    return res.status(400).json({
//         user : 'profile'
//     })
// })

module.exports = router;