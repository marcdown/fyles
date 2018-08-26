var FileStorage = artifacts.require("./FileStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(FileStorage);
};
