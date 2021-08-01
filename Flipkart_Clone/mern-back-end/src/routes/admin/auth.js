const express = require('express');
const { requiresSignin } = require('../../common_middleware');
const { signup, signin, signout} = require('../../controllers/admin/auth');
const { validateSignInRequest, isRequestValidated, validateSignUpRequest } = require('../../validators/auth');
const router = express.Router()


router.post("/admin/signin", validateSignInRequest, isRequestValidated,signin)
router.post("/admin/signup", validateSignUpRequest, isRequestValidated, signup)
router.post("/admin/signout", requiresSignin, signout)

module.exports = router;