import React, { Component } from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { Chat } from './components/Chat.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/chat">
            <Chat />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
