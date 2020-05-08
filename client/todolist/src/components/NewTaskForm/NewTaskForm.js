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
      <form className="new-task-container">
        <div className="new-task-item">
          <label htmlFor="taskName" className="new-task-label">
            Task
          </label>
          <input type="text"
                 id="taskName"
                 className="new-task-input"
                 onChange={this.handleNameChange}
                 value={this.state.name}/>
        </div>
        {this.state.error ? <div className="error">{this.state.error}</div> : ""}


        <div className="new-task-item">
          <label htmlFor="status" className="new-task-label">
            Status
          </label>
          <select id="status"
                  className="new-task-input"
                  onChange={this.handleSelectChange}
                  value={this.state.status}>
            <option value="new">new</option>
            <option value="in progress">in progress</option>
            <option value="completed">completed</option>
            <option value="canceled">canceled</option>
          </select>
        </div>

        <div className="new-task-item">
          <label htmlFor="endDate" className="new-task-label">
            End date
          </label>
          <input type="date"
                 id="endDate"
                 className="new-task-input"
                 onChange={this.handleEndDateChange}
                 value={this.state.endDate}/>
        </div>

        <div>
          <button type="submit"
                  className="btn"
                  onClick={this.save}>
            {this.state.buttonName}
          </button>
        </div>
      </form>
    );
  }
}

export default NewTaskForm;