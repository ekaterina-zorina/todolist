import React from 'react';
import NewTaskForm from "./components/NewTaskForm/NewTaskForm";
import Filter from "./components/Filter/Filter";
import Task from "./components/Task/Task";
import {Link, Redirect} from "react-router-dom";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:3001/tasks");
let authSocket;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      filterValue: "all",
      shouldLogIn: false
    };

    let token = localStorage.getItem("access-token");
    let username = localStorage.getItem("username");
    let userId = localStorage.getItem("userId");

    if (token && username) {
      this.state.isLoggedIn = true;
      this.state.username = username;
      this.state.userId = userId;
    } else {
      this.state.isLoggedIn = false;
      this.state.username = "";
      this.state.userId = "";
    }
  }

  getTasks = (status = "all") => {
    authSocket.emit("getTasks", {
      filter: status,
      userId: this.state.userId
    });

    authSocket.on("getTasks", response => {
      if (response.status === 200) {
        this.setState({tasks: response.tasks});
      }
    });
  }

  addTask = (task) => {
    authSocket.emit("addTask", {
      task: task,
      userId: this.state.userId
    });

    authSocket.on("addTask", response => {
      if (response.status === 401) {
        this.handleUnauthenticatedResponse();
      }

      if (response.status === 201) {
        this.getTasks();
        this.setState({filterValue: "all"});
      }
    });
  }

  updateTask = (newTask, id) => {
    authSocket.emit("updateTask", {newTask, id});

    authSocket.on("updateTask", response => {
      if (response.status === 200) {
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
      } else if (response.status === 401) {
        this.handleUnauthenticatedResponse();
      }
    });
  }

  deleteTask = (id) => {
    authSocket.emit("deleteTask", {id});

    authSocket.on("deleteTask", response => {
      if (response.status === 200) {
        let tasks = this.state.tasks;

        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i]._id === id) {
            tasks.splice(i, 1);
            break;
          }
        }

        this.setState({tasks: tasks});
      } else if (response.status === 401) {
        this.handleUnauthenticatedResponse();
      }
    });
  }

  componentDidMount() {
    let token = localStorage.getItem("access-token");
    if (token) {
      authSocket = io(`http://localhost:3001/tasks?token=${token}`);
    } else {
      authSocket = socket;
    }

    if (this.state.isLoggedIn) {
      this.getTasks();
    }
  }

  changeFilterValue = (selectedValue) => {
    this.setState({filterValue: selectedValue});
  }

  handleUnauthenticatedResponse = () => {
    this.setState({
      tasks: [],
      isLoggedIn: false,
      shouldLogIn: true,
      username: null
    });
  }

  handleLogout = () => {
    this.setState({
      isLoggedIn: false,
      shouldLogIn: false
    });

    localStorage.clear();
    authSocket = socket;
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
