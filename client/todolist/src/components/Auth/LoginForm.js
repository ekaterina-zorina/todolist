import React from "react";
import "./auth.css";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";

const USERS_URL = "http://localhost:3000/users";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
      username: null
    };
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

    let response = await fetch(`${USERS_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      let responseData = await response.json();

      this.setState({
        email: "",
        password: "",
        isLoggedIn: true,
        username: responseData.username
      });
    } else {
      this.setState({error: "Incorrect username or password"});
    }
  }

  componentDidMount() {
    fetch("http://localhost:3000/users/login")
      .then(response => {
        if (response.status === 409) {
          this.setState({
            isLoggedIn: true
          });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.isLoggedIn) {
      return <Redirect to={{
        pathname: "/tasks",
        state: {
          isLoggedIn: true,
          username: this.state.username
        }
      }}/>
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
    )
  }
}

export default LoginForm;