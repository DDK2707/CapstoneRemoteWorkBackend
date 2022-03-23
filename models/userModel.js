const mongoose = require("mongoose")

const userSchema = new mongoose.Schema ({
    username:{
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true, 
        max: 30, 
        unique: true
    },
    password: {
        type: String,
        required: true, 
        min: 6,
        max: 16,
        unique: true
    },
    profilePicture: {
        type: String,
        default: ""
    }, 
    coverPicture: {
        type: String, 
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    }, 
    isAdmin: {
        type: Boolean,
        default: false
    },
    isProducer: {
        type: Boolean,
        default: false
    },
    isExec: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        max: 60
    },
    city: {
        type: String,
        max: 30
    },
    from: {
        type: String, 
        max: 50
    },
    signed: {
        type: Number,
        enum: [1,2,3]
    }
},
{timestamps: true}
);

module.exports = mongoose.model("Users", userSchema)