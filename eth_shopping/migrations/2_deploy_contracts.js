var Shop = artifacts.require("./shop.sol");

module.exports = function(deployer) {
  deployer.deploy(Shop);
};
