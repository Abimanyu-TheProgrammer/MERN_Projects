const User = require('../../models/User')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {

    const check = await User.findOne({ email : req.body.email})
    if(check) return res.status(400).json({message: 'Admin is already registered'})

    const {firstName, lastName, email, password} = req.body
    const newUser = new User({
        firstName, 
        lastName, 
        email, 
        password,
        username : Math.random().toString(),
        role : "admin"
    });

    newUser.save((error, data) => {
        if(data){
            return res.status(201).json({
                message : "Admin Created Succesfully"
            })
        }

        if(error) {
            return res.status(500).json({
                message : "Internal server error"
            })

        }
    })
}

exports.signin = (req, res) => {

    User.findOne({ email : req.body.email })
    .exec((error, user) => {

        if(error) return res.status(400).json({ error });

        if(user){

            if(user.authenticate(req.body.password)) {

                if(user.role !== "admin"){
                    return res.status(403).json({
                        message : "This account is not an admin"
                    })
                }


                const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET_KEY, {expiresIn : '1h'});
                const {firstName, lastName, email, role, fullName} = user;
                res.cookie('token', token, {expiresIn: "1h"})
                res.status(200).json({
                    token,
                    user : {firstName, lastName, email, role, fullName}
                })

            } else {
                return res.status(400).json({
                    message : 'Invalid Password'
                })
            }

        }
        else {
            return res.status(400).json({message: "Something went wrong"});
        }
    })
}

exports.signout = (req, res) => {
    res.clearCookie('token')
    return res.status(200).json({
        message : "Signout successful"
    })
}