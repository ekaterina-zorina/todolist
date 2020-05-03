import React from 'react';
import NewTaskForm from "./components/NewTaskForm/NewTaskForm";
import Filter from "./components/Filter/Filter";
import Task from "./components/Task/Task";
import "./App.css";

const API_URL = "http://localhost:3000/tasks";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      filterValue: "all"
    };
  }

  getTasks = async (status = "all") => {
    let response = await fetch(`${API_URL}?status=${status}`);

    if (response.ok) {
      let tasks = await response.json();
      this.setState({tasks: tasks});
    }
  }

  addTask = async (task) => {
    let response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(task)
    });

    if (response.ok) {
      this.getTasks();
      this.setState({filterValue: "all"});
    }
  }

  updateTask = async (newTask, id) => {
    let response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(newTask)
    });

    if (response.ok) {
      let tasks = this.state.tasks;

      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i]._id === id) {
          tasks[i].name = newTask.name;
          tasks[i].status = newTask.status;
          tasks[i].endDate = newTask.endDate;
          break;
        }
      }

      this.setState({tasks: tasks});
    }
  }

  deleteTask = async (id) => {
    let response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      let tasks = this.state.tasks;

      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i]._id === id) {
          tasks.splice(i, 1);
          break;
        }
      }

      this.setState({tasks: tasks});
    }
  }

  componentDidMount() {
    this.getTasks();
  }

  changeFilterValue = (selectedValue) => {
    this.setState({filterValue: selectedValue});
  }

  render() {
    return (
      <div className="app">
        <h1>TO DO LIST</h1>
        <NewTaskForm tasks={this.state.tasks} add={this.addTask}/>
        <Filter filterValue={this.state.filterValue}
                getTasks={this.getTasks}
                changeFilterValue={this.changeFilterValue}
        />
        {
          this.state.tasks.map((task) => {
            return (
              <Task key={task._id}
                    task={task}
                    update={this.updateTask}
                    delete={this.deleteTask}
              />
            );
          })
        }
      </div>
    );
  }
}

export default App;
