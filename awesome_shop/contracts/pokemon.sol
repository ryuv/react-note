pragma solidity ^0.5.0;

contract pokemon {
    uint public pokeCount = 0;
    struct Poke {
        uint id;
        uint cost;
        string name;
    }

    mapping(address => Poke) myPokemon;

    event pokeCreate(
        uint id,
        uint cost,
        string name
    );
    
    constructor() public {
        buyPokemon(25,112,"Pikachu");
    }

    // buy pokemon
    // payble function
    function buyPokemon(uint256 _id, uint256 _cost, string memory _name) public{
        myPokemon[msg.sender] = Poke(_id,_cost,_name);
        //buyPokemonCost(_cost);
        emit pokeCreate(_id,_cost,_name);
    }

    // function buyPokemonCost(uint _cost) payable public{
        
    // }

    // get pokemon
    function getPokemon() view external returns(uint256, uint256, string memory) {
        return (myPokemon[msg.sender].id, myPokemon[msg.sender].cost, myPokemon[msg.sender].name);
        
    }

    // sell pokemon


}