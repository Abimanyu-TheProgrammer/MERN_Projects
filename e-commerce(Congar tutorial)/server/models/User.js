const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required: true
    },
    avatar : {
        type: String
    },
    role: { //Role of user, either normal or admin
        type: Number,
        default: 0
    },
    history: {
        type : Array,
        default: []
    }
});

module.exports = User = mongoose.model('User', UserSchema)