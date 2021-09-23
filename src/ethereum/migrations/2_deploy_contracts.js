const Contract = artifacts.require("ZombieOwnership");

module.exports = function (deployer) {
  deployer.deploy(Contract);
};
