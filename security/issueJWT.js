const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });
const path = require('path')

const issueJWT = (_id) => {
  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const token = jsonwebtoken.sign(payload, process.env.JWT_KEY, {
    expiresIn,
    algorithm: 'HS256'
  });


  return {
    token: `Bearer ${token}`,
    expires: expiresIn,
  };
};

const verifyJWTMiddleware = (request, response, next) => {
  const tokenParts = request.headers.authorization.split(" ");
  console.log('Seen')
  if (
    tokenParts[0] === "Bearer" &&
    tokenParts[1].match("/$*.$*.$*/") === null
  ) {
    try {
      const token = jsonwebtoken.verify(token, process.env.JWT_KEY, {
        algorithms: ["RS256"],
      });
      request.token = token;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next({ error: "Unauthorized" });
  }
};

module.exports = {
  verifyJWTMiddleware,
  issueJWT
};
