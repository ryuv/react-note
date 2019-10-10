import React, { Component } from "react";
import ShopContract from "./shop.json";
import Web3 from 'web3';

import "./App.css";

class App extends Component {
  
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData(){
    // const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    // const network = await web3.eth.net.getNetworkType();
    // this.setState({web3});
    // this.instantiateContract();


    if (typeof window.ethereum ==! 'undefined'
    || (typeof window.web3 ==! 'undefined')) {
    console.log('aaaaa');
    // Web3 browser user detected. You can now use the provider.
    const provider = window['ethereum'] || window.web3.currentProvider
    }

    if (window.ethereum) {
        const ethereum = window.ethereum
        window.web3 = new Web3(ethereum);
        console.log('eth');
        const web3 = window.web3
        this.setState({web3});

        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            //web3.eth.sendTransaction({/* ... */});
            this.instantiateContract();
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        const web3 = window.web3
        window.web3 = new Web3(web3.currentProvider);
        web3 = window.web3
        this.setState({web3});
        console.log('web3');

        // Acccounts always exposed
        // web3.eth.sendTransaction({/* ... */});
        //this.instantiateContract();
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  


  instantiateContract() {
    const contract = require("truffle-contract");
    const shop = contract(ShopContract);
    shop.setProvider(this.state.web3.currentProvider);


    this.state.web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        shop.deployed().then(instance => {
          this.setState({ shopInstance: instance, myAccount: accounts[0] });
          this.updateMyApples();
          console.log('log:'+this.state.shopInstance);
        });
      }
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      shopInstance: null,
      myAccount: null,
      myApples: 0,
      web3: null
    };
  }

  async buyApple() {
    await this.state.shopInstance.buyApple({
      from: this.state.myAccount,
      value: this.state.web3.utils.toWei('10', "ether"),
      gas: 900000
    });
    window.location.reload();
  }

  async sellApple() {
    await this.state.shopInstance.sellMyApple(this.state.web3.utils.toWei('10', "ether"), {
      from: this.state.myAccount,
      gas: 900000
    });
    window.location.reload();
  }
  
  updateMyApples() {
    this.state.shopInstance.getMyApples().then(result => {
      this.setState({ myApples: result.toNumber() });
    });
  }
  


  // window.addEventListener('load', async () => {
  //   // Modern dapp browsers...
    // if (window.ethereum) {
    //     window.web3 = new Web3(ethereum);
    //     try {
    //         // Request account access if needed
    //         await ethereum.enable();
    //         // Acccounts now exposed
    //         web3.eth.sendTransaction({/* ... */});
    //     } catch (error) {
    //         // User denied account access...
    //     }
    // }
    // // Legacy dapp browsers...
    // else if (window.web3) {
    //     window.web3 = new Web3(web3.currentProvider);
    //     // Acccounts always exposed
    //     web3.eth.sendTransaction({/* ... */});
    // }
    // // Non-dapp browsers...
    // else {
    //     console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    // }
  // });



  render() {
    return (
      <div className="App">
        <h1>사과의 가격: 10 ETH</h1>
        <button onClick={() => this.buyApple()}>구매하기</button>
        <p>내가 가진 사과: {this.state.myApples}</p>
        <button onClick={() => this.sellApple()}>
          판매하기 (판매 가격: {10 * this.state.myApples})
        </button>
      </div>
    );
  }
}

export default App;