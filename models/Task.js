const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: null
    },
    endDate: {
      type: Date,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    versionKey: false
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;