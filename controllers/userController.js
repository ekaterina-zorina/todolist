const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const config = require("../config");

exports.addUser = async function (user) {
  let hash = bcrypt.hashSync(user.password, 10);

  let foundUser = await User.findOne({email: user.email});
  if (foundUser) {
    return {
      status: 400,
      message: "Email address already in use"
    };
  }

  let newUser = new User({
    name: user.name,
    email: user.email,
    password: hash
  });

  try {
    await newUser.save();

    return {
      status: 201,
      message: "User successfully added"
    };
  } catch (e) {
    return {
      status: 500,
      message: e.message
    };
  }
}


exports.loginUser = async function (user) {
  try {
    let foundUser = await User.findOne({email: user.email});
    if (!foundUser) {
      return {
        status: 400,
        message: "Invalid email or password"
      };
    }

    let isPasswordValid = bcrypt.compareSync(user.password, foundUser.password);
    if (!isPasswordValid) {
      return {
        status: 400,
        message: "Invalid email or password"
      };
    }

    let token = jwt.sign({id: foundUser._id}, config.secret, {expiresIn: 259200});
    return {
      status: 200,
      token: token,
      message: "Successfully login",
      username: foundUser.name,
      userId: foundUser._id
    };
  } catch (e) {
    return {
      status: 500,
      message: e.message
    }
  }
};

exports.logoutUser = async function (req, res) {
  res
    .clearCookie("x-access-token")
    .json({message: "User logged out"});
}