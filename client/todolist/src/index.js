import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/tasks" component={App}/>
        <Route path="/users/login" component={LoginForm}/>
        <Route path="/users/register" component={RegistrationForm}/>
        <Redirect exact from="/" to="/tasks"/>
        <Route children={<h1>Page not found</h1>}/>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
