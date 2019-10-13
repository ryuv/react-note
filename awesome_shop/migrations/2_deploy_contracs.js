var pokemon = artifacts.require("./pokemon.sol");

module.exports = function(deployer) {
  deployer.deploy(pokemon);
};
