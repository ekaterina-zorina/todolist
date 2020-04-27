const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

/* GET users listing. */
router.get("/", function (req, res) {
  let query;

  if (!req.query.status || req.query.status === "all") {
    query = {};
  } else {
    query = {status: req.query.status};
  }

  Task.find(query, (err, tasks) => {
    if (err) {
      res.render("error", {
        error: err
      });
    }

    res.render("index", {
      title: "TO DO LIST",
      tasks: tasks
    });
  });
});

router.post("/", function (req, res) {
  if (!req.body.name) {
    return res.redirect("/");
  }

  if (!req.body.endDate) {
    req.body.endDate = new Date();
  }

  let {name, status, endDate} = req.body;
  let task = new Task({name, status, endDate});

  task.save((err) => {
    if (err) {
      res.render("error", {error: err});
    }

    res.redirect("/");
  });
});

module.exports = router;
