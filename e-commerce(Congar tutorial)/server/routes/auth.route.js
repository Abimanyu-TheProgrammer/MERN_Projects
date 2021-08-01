const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken') // to generate token
const bcrypt = require('bcryptjs') // encrypt password

// Check validation for requests

const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar') // get user image by email
const auth = require('../middleware/auth')


// Models 
const User = require('../models/User')


// @route   POST api/users/
// @desc    User Information
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        //get user information
        const user = await User.findById(req.user.id).select('-password')
        res.json({
            user
        })
    } catch (error) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})



// @route   POST api/users/register
// @desc    Register user
// @access   Public
router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
        min:6
    })
], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array()
        })
    }
    // get name, email and password from request
    const {name, email, password} = req.body;

    try{
        // check if user already exists
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                errors : [
                    {
                        msg: 'User already exists'
                    }
                ]
            });
        }

        // if user doesn't exist
        // get image from gravatar
        const avatar = gravatar.url(email, {
            s:'200', //Size
            r:'pg',  // Rate
            d: 'mm'
        })

        // create user object
        user = new User({
            name, email, avatar, password
        })

        //encrypt password
        const salt = await bcrypt.genSalt(10); // generate salt contains 10 

        // save password
        user.password = await bcrypt.hash(password, salt) // use user password and salt to hash password
        
        // save user in database
        await user.save();

        // payload to generate token
        const payload = {
            user: {
                id : user.id
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,{
                expiresIn: 36000 // for development, for production it will be 3600
            },(err, token) => {
                if(err) throw err
                res.json({token})
            }
        )
    } catch(error){
        console.log(error.message)
        res.status(500).send('Server Error')
    }
})


// @route   POST api/users/login
// @desc    Login user
// @access   Public
router.post('/login', [
    check('email', 'please include a valid email').isEmail(),
    check('password', 'password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    // if everything is good
    // get email and password from reques body

    const {email, password} = req.body;

    try {
        let user = await User.findOne({
            email
        })

        // if user is not found
        if(!user){
            return res.status(400).json({
                errors : [{
                    msg : 'Invalid Credentials'
                }]
            })
        }

        // User is found by email
        const isMatch = await bcrypt.compare(password, user.password);

        // if password doesn't match
        if (!isMatch){
            return res.status(400).json({
                errors : [{
                    msg : 'Invalid Credentials'
                }]
            })
        }


        // payload for jwt
        const payload = {
            user: {
                id : user.id
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,{
                expiresIn: 360000
            }, (err, token) => {
                if(err) throw err;
                res.json({
                    token
                })
            }

        )


    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server Error')
    }
})
module.exports = router