const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require:[true, 'Plese enter Your name'],
        maxLength: [30, 'Your name cannot excced 30 cherecter']
    },
    email:{
        type: String,
        require:[true, 'Plese enter Your email'],
        unique: true,
        validate: [validator.isEmail, 'Plese Enter valid email address']
    },
    password:{
        type: String,
        require:[true, 'Plese enter your password'],
        minLength:[6, 'Your password must be at least 6 characters'],
        select: false
    },
    // avatar:{
    //     public_id:{
    //         type: String,
    //         require: true,
    //     },
    //     url:{
    //         type: String,
    //         require: true,
    //     }
    // },
    role:{
        type: String,
        default: 'user'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// Encrypting password before saving user 
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})     

// Compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}
// Return JWT token 
userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Has and set to resetPassword Token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 60 * 1000

    return resetToken
}
module.exports = mongoose.model('User', userSchema);