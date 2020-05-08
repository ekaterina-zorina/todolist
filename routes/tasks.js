const express = require('express');
const router = express.Router();
const taskController = require("../controllers/taskController");
const authorization = require("../auth/authorization");

router.get("/", authorization.authorization, taskController.getTasks)
router.post("/", authorization.authorization, taskController.addTask);
router.put("/:id", authorization.authorization, taskController.editTask);
router.delete("/:id", authorization.authorization, taskController.deleteTask);

module.exports = router;
