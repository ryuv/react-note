pragma solidity ^0.5.0;

contract pokemon {

    struct Poke {
        uint id;
        uint cost;
        string name;
        // ipfs 해쉬값
        string photo;
    }

    mapping(uint => Poke) myPokemon;

    // buy pokemon
    function buyPokemon() payable external{

    }

    // get pokemon

    // sell pokemon


}