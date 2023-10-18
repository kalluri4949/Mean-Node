const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const customError = require("../errors");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new customError.BadRequestError("Email already in use");
  }
  const user = await User.create({ email, password });

  return res.status(201).json({ user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new customError.BadRequestError(
      "Email and Password must be provided"
    );
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new customError.NotFoundError("There is no user with this email");
  }

  const validPassword = await user.comparePassword(password);
  if (!validPassword) {
    throw new customError.BadRequestError("Password Incorrect");
  }

  const token = jwt.sign({ userId: user._id, email }, "jwtSecret", {
    expiresIn: "1h",
  });

  return res
    .status(StatusCodes.OK)
    .json({ token, expiresIn: 3600, userId: user._id });
};

module.exports = {
  signup,
  login,
};
