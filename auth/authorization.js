const jwt = require("jsonwebtoken");
const config = require("../config");

exports.authorization = function (req, res, next) {
  let token = req.cookies["x-access-token"];
  if (!token) {
    res.status(401).send({auth: false, message: "No token provided"});
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(401).send({auth: false, message: "Failed to authenticate token"});
    }
    res.locals.userId = decoded.id;
    next();
  });
}

exports.checkIsAuthenticated = function (req, res, next) {
  let token = req.cookies["x-access-token"];
  if (token) {
    res.status(409).json({message: "User already authenticated"});
  }
}