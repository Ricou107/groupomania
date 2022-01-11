const jwt = require("jsonwebtoken");
//const User = require("../models/user.model");
const db = require('../config/db');

const privateKey = process.env.JWT_KEY;

const verifyAuthentication = async (req, res, next) => {
  try {
    //const userId = req.originalUrl.substr(req.originalUrl.length - 1);
    const bearerToken = req.headers["authorization"];
    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, privateKey);
    db.query("SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)", decoded.id, (err, result) => {
      if (err || Object.values(result[0])[0] == 0) {
        return res.status(401).json({
          message: "You're not authorized to access this information.",
          err
        });
      } /* else if (userId != decoded.id) {
        return res.status(401).json({
          message: "You're not authorized to access this information.",
          err
        }) 
      } */ else {
        next();
      }
    });
  }
  catch (error) {
    console.error(error);
    res.status(401).json({
      message: "You're not authorized to acess this information.",
      error: error.message,
    });
  }
}

module.exports = verifyAuthentication;
