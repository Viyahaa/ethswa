import React, { Component } from 'react';
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'

class SellForm extends Component {

  // state component
  constructor(props) {
      super(props)
      this.state = {
          output: '0'
      }
  }

  render() { // inside curly braces is JS
    return (
        <div>Sell Form...</div>
    );
  }
}

export default SellForm;
