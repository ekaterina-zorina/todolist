const Task = require("../models/Task");

exports.getTasks = async function (req, res) {
  let query;

  if (!req.query.status || req.query.status === "all") {
    query = {};
  } else {
    query = {status: req.query.status};
  }

  query.userId = res.locals.userId;
  try {
    let tasks = await Task.find(query);
    res.status(200).json({data: tasks});
  } catch (e) {
    res.status(500).json({message: e.message});
  }
};

exports.addTask = async function (req, res) {
  if (!req.body.name) {
    return res.status(400).json({message: "Bad request: empty name"});
  }

  if (!req.body.endDate) {
    req.body.endDate = new Date();
  }

  let {name, status, endDate} = req.body;
  let userId = res.locals.userId;
  let task = new Task({name, status, endDate, userId});

  try {
    await task.save();
    res
      .set("Location", `${req.protocol}://${req.get("host")}/tasks/${task._id}`)
      .status(201)
      .json({message: "Task successfully added"});
  } catch (e) {
    res.status(500).json({message: e.message});
  }
};

exports.editTask = async function (req, res) {
  let {name, status, endDate} = req.body;
  let userId = res.locals.userId;
  let newTask = {name, status, endDate, userId};

  try {
    await Task.findByIdAndUpdate(req.params.id, newTask);
    res.status(200).json({message: "Task successfully updated"});
  } catch (e) {
    res.status(500).json({message: e.message});
  }
}

exports.deleteTask = async function (req, res) {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "Task successfully deleted"});
  } catch (e) {
    res.status(500).json({message: e.message})
  }
};