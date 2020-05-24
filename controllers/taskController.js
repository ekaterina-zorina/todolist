const Task = require("../models/Task");

exports.getTasks = async function (filter, userId) {
  if (!filter || filter === "all") {
    query = {};
  } else {
    query = {status: filter};
  }
  query.userId = userId;

  try {
    let tasks = await Task.find(query);
    return {
      status: 200,
      tasks: tasks
    }
  } catch (e) {
    return {
      status: 500,
      message: e.message
    }
  }
};

exports.addTask = async function (task, userId) {
  if (!task.endDate) {
    task.endDate = new Date();
  }

  let {name, status, endDate} = task;
  let newTask = new Task({name, status, endDate, userId});

  try {
    await newTask.save();
    return {
      status: 201,
      message: "Task successfully added"
    };
  } catch (e) {
    return {
      status: 500,
      message: e.message
    }
  }
};

exports.editTask = async function (newTask, id) {
  try {
    await Task.findByIdAndUpdate(id, newTask);
    return {
      status: 200,
      message: "Task successfully updated"
    };
  } catch (e) {
    return {
      status: 500,
      message: e.message
    }
  }
}

exports.deleteTask = async function (id) {
  try {
    await Task.findByIdAndDelete(id);
    return {
      status: 200,
      message: "Task successfully deleted"
    };
  } catch (e) {
    return {
      status: 500,
      message: e.message
    }
  }
};