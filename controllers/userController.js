const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const config = require("../config");

exports.addUser = async function (req, res) {
  let hash = bcrypt.hashSync(req.body.password, 10);

  let user = await User.findOne({email: req.body.email});
  if (user) {
    return res.status(400).json({message: "Email address already in use"});
  }

  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash
  });

  try {
    await newUser.save();

    res
      .set("Location", `${req.protocol}://${req.get("host")}/users/${newUser._id}`)
      .status(201)
      .json({message: "User successfully added"});
  } catch (e) {
    res.status(500).json({message: e.message});
  }
};

exports.loginUser = async function (req, res) {
  let user = {
    email: req.body.email,
    password: req.body.password
  };

  try {
    let foundUser = await User.findOne({email: user.email});
    if (!foundUser) {
      return res.status(400).json({message: "Invalid email or password"});
    }

    let isPasswordValid = bcrypt.compareSync(user.password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({message: "Invalid email or password"});
    }

    let token = jwt.sign({id: foundUser._id}, config.secret, {expiresIn: 259200});
    res
      .status(200)
      .cookie("x-access-token", token, {httpOnly: false})
      .json({message: "Successfully login", username: foundUser.name});
  } catch (e) {
    res.status(500).json({message: e.message});
  }
};

exports.logoutUser = async function (req, res) {
  res
    .clearCookie("x-access-token")
    .json({message: "User logged out"});
}