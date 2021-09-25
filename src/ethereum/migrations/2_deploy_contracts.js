const Contract = artifacts.require("CryptoZombies");

module.exports = function (deployer) {
  deployer.deploy(Contract);
};
