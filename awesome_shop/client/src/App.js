import React, { Component } from "react";
import Web3 from 'web3';
import PokemonContract from './pokemon.json';
import './shop.css'
import "./App.css";

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData()
    await this.instantiateContract()
  }

  async loadBlockchainData() {
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

  instantiateContract() {
    const contract = require("truffle-contract");
    const pokemonContract = contract(PokemonContract);
    pokemonContract.setProvider(this.state.web3.currentProvider);


    this.state.web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        pokemonContract.deployed().then(instance => {
          this.setState({ pokeInstance: instance, myAccount: accounts[0] });
          console.log('log:'+this.state.myAccount);
        });
      }
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      pokeInstance: null,
      myAccount: '',
      web3: null,
      pokemonList: []
    };
  }

  async buyPokemon(){
    console.log("hello")
  }




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
      createPokemonCard(pokemon,id);
    };

    const floating_btn = document.querySelector('.floating-btn');
    const close_btn = document.querySelector('.close-btn');
    const social_panel_container = document.querySelector('.social-panel-container');

    floating_btn.addEventListener('click', () => {
      social_panel_container.classList.toggle('visible')
    });

    close_btn.addEventListener('click', () => {
      social_panel_container.classList.remove('visible')
    });

    function createPokemonCard(pokemon,id) {
      const poke_container = document.querySelector(".poke-container");
      const pokemonEl = document.createElement('div');
      pokemonEl.classList.add('pokemon');
      pokemonEl.classList.add('id'+id);
      console.dir(pokemonEl);

      const poke_types = pokemon.types.map(type => type.type.name);
      const type = main_types.find(type => poke_types.indexOf(type) > -1);
      const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
      const color = colors[type];
      const cost = pokemon.base_experience/50;

      pokemonEl.style.backgroundColor = color;

      const pokeInnerHTML = `
        <div class="img-container">
            <img src="https://pokeres.bastionbot.org/images/pokemon/${
        pokemon.id
        }.png" alt="${name}" />
        </div>
        <div class="info">
            <span class="number">#${pokemon.id
          .toString()
          .padStart(3, '0')}</span>
            <h3 class="name">${name}</h3>
            <small class="type">Type: <span>${type}</span></small>
            <h3 class="name" >💰${cost} ETH</h3>
        </div>
    `;

      pokemonEl.innerHTML = pokeInnerHTML;

      poke_container.appendChild(pokemonEl);
    }
    fetchPokemons();
  };


  render() {

    return (
      <div>
        <h2 className="pokemon"> Buy Pokémon with Blockchain💎</h2>
        <div className="poke-container"></div>


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
