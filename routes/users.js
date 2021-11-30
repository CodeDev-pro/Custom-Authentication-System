const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { verifyJWTMiddleware, issueJWT } = require("../security/issueJWT");
const { isEmail } = require("validator").default;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const validateEmail = isEmail(username);
  try {
    const user = await User.login(username, password, validateEmail);
    const _id = user._id;
    const token = issueJWT(_id);
    response.status(200).json({ user, token });
  } catch (error) {
    response.status(404).send({ error: error.message });
  }
});

router.post("/register", async (request, response) => {
  const { firstName, lastName, password, email, username } = request.body;
  console.log(request.body)
  try {
    const user = await User.create({ firstName, lastName, username, email, password })
    const _id = user._id;
    const token = issueJWT(_id);
    response.status(200).json({ user, token });
  } catch (error) {
    response.status(404).send({ error: error.message });
  }
});

module.exports = router;
