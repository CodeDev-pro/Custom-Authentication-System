const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });
const path = require('path');
const { Worker } = require('worker_threads')

const issueJWT = (_id, expiresIn = '1d') => {

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
        algorithms: ["HS256"],
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

const verifyJWT = (request) => {
  const tokenParts = request.headers.authorization.split(" ");
  const token = tokenParts[1]
  try {
    if (
      tokenParts[0] === "Bearer"
    ) {
      const payload = jsonwebtoken.verify(token, process.env.JWT_KEY, {
        algorithms: ["HS256"],
      });
      if(payload) {
        return payload
      } 
      throw Error("invalid token")
    }else {
      throw Error("Unauthorized")
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  verifyJWTMiddleware,
  issueJWT,
  verifyJWT
};
