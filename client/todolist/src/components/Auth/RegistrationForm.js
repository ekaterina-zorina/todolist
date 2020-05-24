import React from "react";
import "./auth.css";
import {Link} from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001/users/register");

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      usernameError: "",
      emailError: "",
      passwordError: "",
      error: "",
      success: ""
    };
  }

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value,
      success: ""
    });
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
      success: ""
    });
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
      success: ""
    });
  }

  checkFields(username, email, password) {
    let usernameError, emailError, passwordError;

    usernameError = (username.length < 3) ? "Username must be at least 3 characters" : "";

    let regexp = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    emailError = (!regexp.test(email)) ? "Enter a valid email address" : "";

    passwordError = (password.length < 6) ? "Password must be at least 6 characters" : "";
    this.setState({usernameError, emailError, passwordError});
  };

  submitRegistration = async (e) => {
    e.preventDefault();
    await this.checkFields(this.state.name, this.state.email, this.state.password);

    if (this.state.usernameError || this.state.emailError || this.state.passwordError) {
      return;
    }

    let user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };

    socket.emit("registration", user);
    socket.on("registration", response => {
      if (response.status === 201) {
          this.setState({
            name: "",
            email: "",
            password: "",
            usernameError: "",
            emailError: "",
            passwordError: "",
            error: "",
            success: "User successfully registered"
          });
        } else {
          this.setState({
            error: response.message
          });
        }
    });
  }

  render() {
    return (
      <div>
        <header>
          <Link to="/" className="header-link">TO DO LIST</Link>
        </header>

        <form className="auth-container" onSubmit={this.submitRegistration}>
          <div className="auth-header">Create your account</div>

          <div className="auth-inner-container">
            <div className="auth-item">
              <label htmlFor="username" className="auth-label">
                Username
              </label>
              <input type="text"
                     id="username"
                     className="auth-input"
                     onChange={this.handleNameChange}
                     value={this.state.name}/>

              {this.state.usernameError ? <div className="error">{this.state.usernameError}</div> : ""}
            </div>

            <div className="auth-item">
              <label htmlFor="email" className="auth-label">
                Email
              </label>
              <input type="text"
                     id="email"
                     className="auth-input"
                     onChange={this.handleEmailChange}
                     value={this.state.email}/>

              {this.state.emailError ? <div className="error">{this.state.emailError}</div> : ""}
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

              {this.state.passwordError ? <div className="error">{this.state.passwordError}</div> : ""}
              {this.state.error ? <div className="error">{this.state.error}</div> : ""}
            </div>

            <button type="submit" className="btn auth-btn">
              Create account
            </button>
            {this.state.success ? <div className="success">{this.state.success}</div> : ""}
          </div>

          <div className="redirect-item">
            Already have an account?&nbsp;
            <Link to="/users/login" className="redirect-link">
              Sign in
            </Link>
          </div>
          <div>{this.state.message}</div>
        </form>
      </div>
    )
  }
}

export default RegistrationForm;