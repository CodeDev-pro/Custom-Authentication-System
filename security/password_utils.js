const crypto = require("crypto");

function validatePassword(password) {
    return false
}

function isPasswordValid(password, hash, salt) {
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash == verifyHash;
}
function generatePassword(password) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { salt, hash };
}

module.exports = {
  validatePassword,
  isPasswordValid,
  generatePassword
};