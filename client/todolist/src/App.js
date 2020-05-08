import React from 'react';
import NewTaskForm from "./components/NewTaskForm/NewTaskForm";
import Filter from "./components/Filter/Filter";
import Task from "./components/Task/Task";
import {Link, Redirect} from "react-router-dom";
import "./App.css";

const TASKS_URL = "http://localhost:3000/tasks";
const USERS_URL = "http://localhost:3000/users";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      filterValue: "all",
      shouldLogIn: false
    };

    if (this.props.location.state) {
      this.state.isLoggedIn = this.props.location.state.isLoggedIn;
      this.state.username = this.props.location.state.username;
    } else {
      this.state.isLoggedIn = false;
      this.state.username = null;
    }
  }

  getTasks = async (status = "all") => {
    let response = await fetch(`${TASKS_URL}?status=${status}`);

    this.handleResponse(response);

    if (response.ok) {
      let json = await response.json();
      let tasks = json.data;
      this.setState({tasks: tasks});
    }
  }

  addTask = async (task) => {
    let response = await fetch(TASKS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(task)
    });

    this.handleResponse(response);

    if (response.ok) {
      this.getTasks();
      this.setState({filterValue: "all"});
    }
  }

  updateTask = async (newTask, id) => {
    let response = await fetch(`${TASKS_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(newTask)
    });

    this.handleResponse(response);

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
    let response = await fetch(`${TASKS_URL}/${id}`, {
      method: "DELETE"
    });

    this.handleResponse(response);

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
    if (this.state.isLoggedIn) {
      this.getTasks();
    }
  }

  changeFilterValue = (selectedValue) => {
    this.setState({filterValue: selectedValue});
  }

  handleResponse = (response) => {
    if (response.status === 401) {
      this.setState({
        tasks: [],
        isLoggedIn: false,
        shouldLogIn: true,
        username: null
      });
    } else if (response.ok) {
      this.setState({
        isLoggedIn: true,
        shouldLogIn: false
      });
    }
  }

  handleLogout = async () => {
    let response = await fetch(`${USERS_URL}/logout`);
    if (response.ok) {
      this.setState({
        isLoggedIn: false,
        shouldLogIn: false
      });
    }
  }

  renderAuthenticatedUser() {
    return (
      <div className="app">
        <header>
          <Link to="/" className="header-link">TO DO LIST</Link>

          <div className="links-container">
            {
              (this.state.username) ?
                <div className="username">{this.state.username}</div> : ""
            }

            <button type="button"
                    className="btn logout-btn"
                    onClick={this.handleLogout}>
              Sign out
            </button>
          </div>

        </header>
        <main>
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
        </main>
      </div>
    );
  }

  renderUnauthenticatedUser() {
    return (
      <div className="app">
        <header>
          <Link to="/" className="header-link">TO DO LIST</Link>

          <div className="links-container">
            <Link to="/users/login" className="link">
              Sing in
            </Link>
            <Link to="/users/register" className="link">
              Registration
            </Link>
          </div>
        </header>
        <main>
          <NewTaskForm tasks={this.state.tasks} add={this.addTask}/>
        </main>
      </div>
    );
  }

  render() {
    if (this.state.shouldLogIn) {
      return <Redirect to="/users/login"/>;
    }

    if (this.state.isLoggedIn) {
      return this.renderAuthenticatedUser();
    }
    return this.renderUnauthenticatedUser();
  }
}

export default App;
