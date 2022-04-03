import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import NavBar from "./NavBar";
import Main from "./Main";

import EthSwap from '../abis/EthSwap.json';
import Token from '../abis/Token.json';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();    
  }

  // async componentDidUpdate(){
  //   await this.loadBlockChainData();    
  // }

  async loadBlockChainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0],
    });    

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });    

    const networkId = await web3.eth.net.getId();

    //Load Token
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });

      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      window.alert('Token contract not deployed to detected network')
    }

    //Load EthSwap
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });
      console.log(this.state);

    } else {
      window.alert('Eth-Swap contract not deployed to detected network')
    }    
    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying metamask."
      );
    }
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true });
    this.state.ethSwap.methods.buyTokens()
      .send({ value: etherAmount, from: this.state.account })
      .on('transactionHash', async (hash) => {        
        await this.loadWeb3();
        await this.loadBlockChainData();
      });
  }

  sellTokens = (tokenAmount) => {
   this.setState({ loading: true });
   this.state.token.methods
     .approve(this.state.ethSwap.address, tokenAmount)
     .send({ from: this.state.account })
     .on("transactionHash", async (hash) => {
       this.state.ethSwap.methods
         .sellTokens(tokenAmount)
         .send({ from: this.state.account })
         .on("transactionHash", async (hash) => {
           await this.loadWeb3();
           await this.loadBlockChainData();
         });
     });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      ethBalance: '0',
      token: {},
      ethSwap: {},
      tokenBalance: '0',
      loading: true,
    }
  }

  render() {
    let content;    

    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
        ethBalance={this.state.ethBalance} 
        tokenBalance={this.state.tokenBalance} 
        buyTokens={this.buyTokens} 
        sellTokens={this.sellTokens}/>
    }
    return (
      <div>
        <NavBar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mt-5 pt-5 mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
