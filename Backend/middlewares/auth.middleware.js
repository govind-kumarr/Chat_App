var jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const secret = process.env.SECRET;
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, secret);
    if (decoded) {
      req.user = decoded;
      next();
    } else return res.status(401);
  } catch (error) {
    console.log(error.message);
    return res.json({ error: "Error verifying Token" });
  }
};

module.exports = {
  verifyToken
}
