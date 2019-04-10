import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

// Project Components
import ProjectDetails from './components/projects/ProjectDetails';
import TaskDetails from './components/tasks/TaskDetails';
import Signup from './components/auth/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthService from './components/auth/auth-service';
import ProjectList from './components/projects/ProjectList';
import Navbar from './components/navbar/Navbar';
import Login from './components/auth/login';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
    this.service = new AuthService();
  }

  getTheUser = userObj => {
    this.setState({
      loggedInUser: userObj,
    });
  };

  fetchUser() {
    if (this.state.loggedInUser === null) {
      this.service
        .loggedin()
        .then(response => {
          this.setState({
            loggedInUser: response,
          });
        })
        .catch(err => {
          this.setState({
            loggedInUser: false,
          });
        });
    }
  }

  render() {
    {
      this.fetchUser();
    }
    if (this.state.loggedInUser) {
      return (
        <div className="App">
          <Navbar
            userInSession={this.state.loggedInUser}
            getUser={this.getTheUser}
          />
          <Switch>
            <ProtectedRoute
              user={this.state.loggedInUser}
              path="/projects/:id"
              component={ProjectDetails}
            />
            <ProtectedRoute
              user={this.state.loggedInUser}
              path="/projects"
              component={ProjectList}
            />
          </Switch>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Navbar
            userInSession={this.state.loggedInUser}
            getUser={this.getTheUser}
          />
          <Switch>
            <Route
              exact
              path="/signup"
              render={() => <Signup getUser={this.getTheUser} />}
            />
            <Route
              exact
              path="/"
              render={() => <Login getUser={this.getTheUser} />}
            />
            <ProtectedRoute
              user={this.state.loggedInUser}
              path="/projects/:id"
              component={ProjectDetails}
            />
            <ProtectedRoute
              user={this.state.loggedInUser}
              path="/projects"
              component={ProjectList}
            />
          </Switch>
        </div>
      );
    }
  }
}

export default App;
