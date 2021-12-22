const mongoose = require('mongoose');
const { isEmail } = require('validator').default;

const otpSchema = new mongoose.Schema({
    code: {
        type: Number,
        expires: 7200
    },
    expiresIn: {
        type: Date,
        default: Date.now(),
        expires: 7200
    },
    email: {
        type: String,
        lowercase: true,
        validate: [isEmail, "please enter a valid email"]
    },
})

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;