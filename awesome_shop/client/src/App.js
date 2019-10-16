import React, { Component } from "react";
import Web3 from 'web3';
import PokemonContract from './pokemon.json';
import './shop.css';
import "./App.css";
import Poketmon from './Poketmon.js';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      this.setState({ web3: window.web3 })
    } if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      this.setState({ web3: window.web3 })
    } else {
      window.alert('please use metamask')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ myAccount: accounts[0] })
    const networkId = await web3.eth.net.getId()

    const networkData = PokemonContract.networks[networkId]
    if (networkData) {
      const contract = new web3.eth.Contract(PokemonContract.abi, PokemonContract.networks['5777'].address)
      this.setState({ contract })
      console.dir(this.state.contract);
      const myPokemonList = await contract.methods.getPokemon().call()
      this.setState({ myPokemonList })
      console.log(this.state.myPokemonList)
    } else {
      window.alert('Smart contract not deployed to detected network!')
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      contract: null,
      myAccount: '',
      web3: null,
      pokemonList: [],
      myPokemonList: []
    };
  }

  async buyPokemon(id,cost,name){
     const web3 = window.web3
     const accounts = await web3.eth.getAccounts()

    const networkId = await web3.eth.net.getId()

    const networkData = PokemonContract.networks[networkId]
    if (networkData) {
      console.log(id,cost,name);
      const contract = new web3.eth.Contract(PokemonContract.abi, PokemonContract.networks['5777'].address)
      await contract.methods.buyPokemon(id,cost,name).send({from:accounts[0]},function(error, transactionHash){
        console.log(transactionHash)
      })
    } else {
      window.alert('Smart contract not deployed to detected network!')
    }
  }

  // FRONT_END
  componentDidMount() {
    this.getPoke();
  }

  getPoke = async () => {
    const pokemons_number = 151;
    const colors = {
      fire: '#FDDFDF',
      grass: '#DEFDE0',
      electric: '#FCF7DE',
      water: '#DEF3FD',
      ground: '#f4e7da',
      rock: '#d5d5d4',
      fairy: '#fceaff',
      poison: '#98d7a5',
      bug: '#f8d5a3',
      dragon: '#97b3e6',
      psychic: '#eaeda1',
      flying: '#F5F5F5',
      fighting: '#E6E0D4',
      normal: '#F5F5F5'
    };
    const main_types = Object.keys(colors);

    const fetchPokemons = async () => {
      for (let i = 1; i <= pokemons_number; i++) {
        await getPokemon(i);
      }
    };

    const getPokemon = async id => {
      const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
      //console.log(url);
      const res = await fetch(url);
      const pokemon = await res.json();

      const poke_types = pokemon.types.map(type => type.type.name);
      const type = main_types.find(type => poke_types.indexOf(type) > -1);
      const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
      const color = colors[type];
      const cost = pokemon.base_experience;
      const arr = {
        "id" : id,
        "poke_types" : poke_types,
        "type" : type,
        "name" : name,
        "color" : color,
        "cost" : cost
      };
      
      this.setState({
        pokemonList: this.state.pokemonList.concat(arr)
      })

    };

    //Pokemon Ball button
    const floating_btn = document.querySelector('.floating-btn');
    const close_btn = document.querySelector('.close-btn');
    const social_panel_container = document.querySelector('.social-panel-container');

    floating_btn.addEventListener('click', () => {
      social_panel_container.classList.toggle('visible')
    });

    close_btn.addEventListener('click', () => {
      social_panel_container.classList.remove('visible')
    });


    fetchPokemons();
  };


  render() {
    const {pokemonList} = this.state;
    return (
      <div>
        <h2 className="pokemon"> Buy Pokémon with Blockchain💎</h2>
        <div className="poke-container" >
            {pokemonList.map(a => (
              <Poketmon
                id={a.id}
                poke_types={a.poke_types}
                color={a.color}
                name={a.name}
                type={a.type}
                cost={a.cost}
                onClick={this.buyPokemon}
              />
            ))}
        </div>


        <div class="social-panel-container">
          <div class="social-panel">
            <p>Pokémon ball 🏀</p>
            <button class="close-btn"><i class="fas fa-times"></i></button>
            <h4>My Pokémon</h4>
            <ul>
              <li>
                <a href="" target="_blank">
                  <i class="fab fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="" target="_blank">
                  <i class="fab fa-linkedin"></i>
                </a>
              </li>
              <li>
                <a href="" target="_blank">
                  <i class="fab fa-facebook"></i>
                </a>
              </li>
              <li>
                <a href="" target="_blank">
                  <i class="fab fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <button class="floating-btn">
          Pokémon ball 🏀
        </button>


      </div>
    );
  }
}

export default App;
