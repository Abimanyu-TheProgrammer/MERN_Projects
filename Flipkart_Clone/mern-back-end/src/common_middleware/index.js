const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.requiresSignin = (req, res, next) => {
    // const token = req.headers.authorization.split(" ")[1] this won't get detected if the header doesn't have "authorization"
    const token = req.header('authorization').split(" ")[1]
    
    if (!token){
        return res.status(403).json({
            message : "No token, access denied"
        })
    }

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = user
    next()

    
}


exports.userMiddleware = async (req, res, next) => {
    
    const user = await User.findOne({_id : req.user._id})
    if(user.role !== "user"){
        return res.status(403).json({
            message : "Only users are permitted"
        })
    }
    next()
}

exports.adminMiddleware = async (req, res, next) => {

    const user = await User.findOne({_id : req.user._id})
    if(user.role !== "admin"){
        return res.status(403).json({
            message : "Admin access required"
        })
    }
    next()
}