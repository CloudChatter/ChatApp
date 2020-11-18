import React, { Component } from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { Chat } from './components/Chat.jsx';
import Login from './components/Login.jsx';

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/'> 
            <Login /> 
          </Route>
          <Route exact path='/chat'> 
            <Chat /> 
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
