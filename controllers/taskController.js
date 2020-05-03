const Task = require("../models/Task");

exports.getTasks = function (req, res) {
  let query;

  if (!req.query.status || req.query.status === "all") {
    query = {};
  } else {
    query = {status: req.query.status};
  }

  Task.find(query, (err, tasks) => {
    if (err) {
      return res.status(500).json({message: err.message});
    }

    res.status(200).json(tasks);
  });
};

exports.addTask = function (req, res) {
  if (!req.body) {
    return res.status(400).json({message: "Bad request"});
  }

  if (!req.body.endDate) {
    req.body.endDate = new Date();
  }

  let {name, status, endDate} = req.body;
  let task = new Task({name, status, endDate});

  task.save((err) => {
    if (err) {
      return res.status(500).json({message: err.message});
    }

    res.set({
      "Location": `${req.protocol}://${req.get("host")}/tasks/${task._id}`
    }).status(201).json({message: "Task successfully added"});
  });
};

exports.editTask = function (req, res) {
  if (!req.body) {
    return res.status(400).json({message: "Bad request"});
  }

  let {name, status, endDate} = req.body;
  let newTask = {name, status, endDate};

  Task.findByIdAndUpdate(req.params.id, newTask, {new: true}, (err, task) => {
    if (err) {
      return res.status(500).json({message: err.message});
    }

    res.status(200).json({message: "Task successfully updated"});
  });
}

exports.deleteTask = function (req, res) {
  Task.findByIdAndDelete(req.params.id, (err, task) => {
    if (err) {
      return res.status(500).json({message: err.message});
    }

    res.status(200).json({message: "Task successfully deleted"});
  });
};