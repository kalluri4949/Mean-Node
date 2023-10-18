const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  if (!token) {
    return next(
      new customError.UnauthorizedError(`Access Denied. No Token Provided`)
    );
  }
  try {
    const decoded = await jwt.verify(token, "jwtSecret");
    console.log(decoded);
    req.userData = {
      email: decoded.email,
      userId: decoded.userId,
    };
  } catch (error) {
    return next(new customError.UnauthorizedError(`Invalid Token`));
  }
  next();
};

module.exports = authenticateUser;
