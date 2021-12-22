const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { verifyJWT, issueJWT } = require("../security/issueJWT");
const { isEmail } = require("validator").default;
const { sendMail } = require('../config/mailing')
const { verifyOtp } = require('../config/otp_authentication');
const Otp = require('../models/otp');
const handleResponse = require('../config/error_handler').handleResponse;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const validateEmail = isEmail(username);
  try {
    const user = await User.login(username, password, validateEmail);
    if(user.isValidated) {
      const _id = user._id;
      const token = issueJWT(_id);
      const res = handleResponse("user logged in successfully", true, {user, token})
      response.status(200).json(res);
    } else {
      const res = handleResponse("user not validated", false, { user: null })
      response.status(200).json(res)
    }
  } catch (error) {
    const res = handleResponse("user logged in successfully", false, {error: error.message})
    response.status(404).send(res);
  }
});

router.post("/verify_otp", async (request, response) => {
  const { otp, email } = request.body;
  try {
    const result = await verifyOtp(otp, email);
    const user = await User.findOneAndUpdate({ email }, { isValidated: true });
    const token = issueJWT(user._id)
    const res = handleResponse("user verified successfully", true, {user, token, otp: result})
    response.send(res)
  } catch (error) {
    const res = handleResponse("verification failed", false, {error: error.message})
    response.send(res)
  }
});

router.post('/resend_otp', async (request, response) => {
  const { email } = request.body;
  try {
    const user = await User.findOne({ email });
    if(user) {
      await Otp.deleteOne({ email })
      await sendMail(email)
      const res = handleResponse("otp sent successfully", true, {user})
      response.send(res)
    } else {
      const res = handleResponse("user does not exist", false, {user: null})
      response.send(res)
    }
  } catch (error) {
    const res = handleResponse("user does not exist", false, {error: error.message})
    response.send(res)
  }
})

router.post("/register", async (request, response) => {
  const { firstName, lastName, password, email, username } = request.body;
  console.log(request.body)
  try {
    const user = await User.create({ firstName, lastName, username, email, password })
    await sendMail(email)
    const res = handleResponse("otp sent successfully", true, {user})
    response.status(200).send(res)
  } catch (error) {
    const res = handleResponse("an error occured", false, {error: error.message})
    response.status(404).send(res);
  }
});

router.post("/forgot_password", async (request, response) => {
  const { email } = request.body;

  try{
    const user = await User.findOne({ email })
    if(user) {
      await sendMail(email)
      const res = handleResponse("otp sent successfully", true, {user})
      response.send(res)
    } else {
      const res = handleResponse("user does not exist", false, {user: null})
      response.send(res)
    }
  }catch(e) {
    response.send({message: "an error occurred", error: error.message})
  }
})

router.post("/verify_reset_request", async (request, response) => {
  const { otp, email } = request.body;
  try {
    const result = await verifyOtp(otp, email);
    const user = await User.findOne({ email });
    const token = issueJWT(user._id)
    const res = handleResponse("otp verified successfully", true, {user, token})
    response.send(res)
  } catch (error) {
    const res = handleResponse("an error occured", false, {error: error.message})
    response.send(res)
  }
});

router.post('/reset_password', async (request, response) => {
  const { password, id } = request.body;
  try {
    const payload = verifyJWT(request)
    if(id == payload.sub) {
      const user = await User.changePassword(id, password)
      if(user) {
        const res = handleResponse("password changed successfully", true, {user})
        response.send({ user })
      } else {
        const res = handleResponse("user does not exist", false, {user: null})
        response.send({ user })
      }
    } else {
      const res = handleResponse("user does not exist", false, {user: null, payload})
      response.send(res)
    }
  } catch (error) {
    const res = handleResponse("an error occured", false, {error: error.message})
    response.send(res)
  }
});

/* router.post('/reset-password/:id/:token', async (request, response) => {
  const { id, token } = request.params;
  const user = await User.findById(id)
  const payload = verifyJWT(token)
}); */

router.post("/google-sign-in", (request, response) => {

})

module.exports = router;
