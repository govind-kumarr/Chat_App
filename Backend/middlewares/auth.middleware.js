const { verifyJwt } = require("../utils/jwt.utils");

const validateSession = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    const { decoded, valid } = verifyJwt(accessToken);
    if (decoded && valid) {
      req.locals = {
        user: false,
      };
      req.locals.user = decoded;
    }
    return next();
  } else {
    console.log("token not present");
    return next();
  }
};

module.exports = { validateSession };
