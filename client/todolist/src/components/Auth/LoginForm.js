import React from "react";
import "./auth.css";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001/users/login");

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      error: ""
    };

    let token = localStorage.getItem("access-token");
    let username = localStorage.getItem("username");

    this.state.isLoggedIn = token & username;
  }

  handleEmailChange = (e) => {
    this.setState({email: e.target.value});
  }

  handlePasswordChange = (e) => {
    this.setState({password: e.target.value});
  }

  submitLogin = async (e) => {
    e.preventDefault();
    let user = {
      email: this.state.email,
      password: this.state.password
    };

    socket.emit("login", user);
    socket.on("login", response => {
      if (response.status === 200) {
        localStorage.setItem("access-token", response.token);
        localStorage.setItem("username", response.username);
        localStorage.setItem("userId", response.userId);

        this.setState({
          email: "",
          password: "",
          isLoggedIn: true,
          username: response.username
          });
      } else {
        this.setState({
          error: "Incorrect username or password"
        });
      }
    });
  }

  render() {
    if (this.state.isLoggedIn) {
      return <Redirect to="/tasks"/>
    }

    return (
      <div>
        <header>
          <Link to="/" className="header-link">TO DO LIST</Link>
        </header>
        <form className="auth-container" onSubmit={this.submitLogin}>
          <div className="auth-header">Sign in</div>

          <div className="auth-inner-container">
            <div className="auth-item">
              <label htmlFor="email" className="auth-label">
                Email
              </label>
              <input type="text"
                     id="email"
                     className="auth-input"
                     onChange={this.handleEmailChange}
                     value={this.state.email}/>
            </div>

            <div className="auth-item">
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <input type="password"
                     id="password"
                     className="auth-input"
                     onChange={this.handlePasswordChange}
                     value={this.state.password}/>
            </div>

            {this.state.error ? <div className="error">{this.state.error}</div> : ""}

            <button type="submit" className="btn auth-btn">
              Sign in
            </button>
          </div>

          <div className="redirect-item">
            or&nbsp;
            <Link to="/users/register" className="redirect-link">
              Create new account
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginForm;