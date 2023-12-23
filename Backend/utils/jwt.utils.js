const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET;

function signJwt(object, options) {
  return jwt.sign(object, secret, options);
}

function verifyJwt(token) {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}

module.exports = {
  signJwt,
  verifyJwt,
};
