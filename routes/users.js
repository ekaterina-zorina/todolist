const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authorization = require("../auth/authorization");

router.post("/register", userController.addUser);
router.get("/login", authorization.checkIsAuthenticated);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);

module.exports = router;