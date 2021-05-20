import React, { Component } from 'react';
import Web3 from 'web3'
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import NavBar from './NavBar'

import './App.css';

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const web3 = window.web3

        // get accounts to display balance (e.g. max to buy)
        const accounts = await web3.eth.getAccounts()
        // set state to access the data in other places in the application
        this.setState({ account: accounts[0]})

        const ethBalance = await web3.eth.getBalance(this.state.account)
        this.setState({ ethBalance }) // same as ethBalance: ethBalance

        // load token
        const networkId = await web3.eth.net.getId() // get id of network connected via metamask
        const tokenData = Token.networks[networkId]
        if(tokenData) {
            const token = new web3.eth.Contract(Token.abi, tokenData.address)
            this.setState({ token })
            let tokenBalance = await token.methods.balanceOf(this.state.account).call() // call to fetch info from blockchain
            this.setState({ tokenBalance: tokenBalance.toString()})
        } else {
            window.alert('Token contract not deployed to detected networks')
        }


    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    constructor(props) {
    super(props) // calls constructor on class we are extending
    this.state = {
        account: '',
        token: {},
        ethBalance: '0',
        tokenBalance: '0'
    }
  }

  render() { // inside curly braces is JS
    return (
      <div>
        <NavBar account={this.state.account}/> // Puts NavBar in its own component & sends state to access balance
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                <h1>Hello World</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
