const otpGenerator = require('otp-generator');
const Otp = require('../models/otp')
const User = require('../models/user')
const addMinutesToDate = (date, minutes) => {
    return new Date(date.getTime() + (minutes * 60000))
}

module.exports.createOtp = () => {
    const code = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    return code;
}

module.exports.verifyOtp = async (code, email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const otp = await Otp.findOne({code});
            if(otp && email == otp.email) {
                resolve({ success: true, otp })
            } else {
                reject({ success: false, message: "otp is not valid shsa", otp: null })
            }
        } catch (error) {
            reject({message: error.message, success: false})
        }
    })
}