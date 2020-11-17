import React, { Component } from 'react';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
  }

  render() {
    return (
      <div>
        <h1>Hello Squirtle World!</h1>
        <p>Current value of number is {this.state.number}</p>
        <button
          onClick={() => this.setState({ number: this.state.number + 1 })}
        >
          Change State
        </button>
      </div>
    );
  }
}

export default App;
