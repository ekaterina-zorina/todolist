import React from "react";
import "./NewTaskForm.css";

class NewTaskForm extends React.Component {
  constructor(props) {
    super(props);

    if (this.props.task) {
      this.state = {
        name: this.props.task.name,
        status: this.props.task.status,
        endDate: this.props.task.endDate,
        buttonName: "Save",
        error: ""
      };
    } else {
      this.state = {
        name: "",
        status: "new",
        endDate: "",
        buttonName: "Add task",
        error: ""
      };
    }
  }

  handleNameChange = (e) => {
    this.setState({name: e.target.value});
  }

  handleSelectChange = (e) => {
    this.setState({status: e.target.value});
  }

  handleEndDateChange = (e) => {
    this.setState({endDate: e.target.value});
  }

  save = (e) => {
    e.preventDefault();
    if (!this.state.name) {
      this.setState({error: "Please enter task"});
      return;
    }

    let newTask = {
      name: this.state.name,
      status: this.state.status,
      endDate: this.state.endDate
    }

    this.setState({
      name: "",
      status: "new",
      endDate: "",
      error: ""
    });

    if (this.props.task) {
      this.props.save(newTask);
    } else {
      this.props.add(newTask);
    }
  }

  render() {
    return (
      <form className="new-task-container" onSubmit={this.save}>
        <div className="new-task-item">
          <label htmlFor="taskName">Task:</label>
          <input type="text" id="taskName"
                 onChange={this.handleNameChange}
                 value={this.state.name}/>
        </div>
        {this.state.error ? <div className="error">{this.state.error}</div> : ""}


        <div className="new-task-item">
          <label htmlFor="status">Status:</label>
          <select id="status"
                  onChange={this.handleSelectChange}
                  value={this.state.status}>
            <option value="new">new</option>
            <option value="in progress">in progress</option>
            <option value="completed">completed</option>
            <option value="canceled">canceled</option>
          </select>
        </div>

        <div className="new-task-item">
          <label htmlFor="endDate">End date:</label>
          <input id="endDate" type="date"
                 onChange={this.handleEndDateChange}
                 value={this.state.endDate}/>
        </div>

        <div className="new-task-item">
          <input className="btn" type="submit" value={this.state.buttonName}/>
        </div>
      </form>
    );
  }
}

export default NewTaskForm;