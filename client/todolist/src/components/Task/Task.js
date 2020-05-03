import React from "react";
import NewTaskForm from "../NewTaskForm/NewTaskForm";
import "./Task.css";

class Task extends React.Component {
  constructor(props) {
    super(props);

    let task = this.props.task;
    let endDate = new Date(this.props.task.endDate);
    task.endDate = endDate.toISOString().slice(0, 10)

    this.state = {
      task: task,
      edit: false
    };
  }

  update = () => {
    this.setState({edit: true});
  }

  delete = () => {
    this.props.delete(this.state.task._id);
  }

  save = (newTask) => {
    this.props.update(newTask, this.state.task._id);

    let task = this.state.task;
    task.name = newTask.name;
    task.status = newTask.status;
    task.endDate = newTask.endDate;

    this.setState({
      task: task,
      edit: false
    });
  }

  render() {
    if (this.state.edit) {
      return <NewTaskForm task={this.state.task}
                          save={this.save}/>
    }

    return (
      <div className="task-container">
        <div className="task-name">{this.state.task.name}</div>
        <div>Status: {this.state.task.status}</div>
        <div>End date: {this.state.task.endDate}</div>
        <div className="buttons-container">
          <button className="btn" onClick={this.update}>Edit</button>
          <button className="btn" onClick={this.delete}>Delete</button>
        </div>
      </div>
    );
  }
}

export default Task;