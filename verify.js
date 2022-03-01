const jwt = require("jsonwebtoken");
const env = require("dotenv");

env.config();

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.jwt_secret, (err, payload) => {
      if (err) {
        console.log(err);
        console.log("token not valid");
        return res.status(403).json("token is not valid");
      } else {
        req.admin = payload;
      }
    });
    next();
  } else {
    res.status(401).json("not authenticated");
    next();
  }
};

module.exports = verify;
