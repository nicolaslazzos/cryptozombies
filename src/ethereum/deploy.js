const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { mnemonic, rinkeby } = require("./env");

const { interface, bytecode } = require("./build/contracts/ZombieOwnership.json");

const provider = new HDWalletProvider(mnemonic, rinkeby);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("deploying contract from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: `0x${bytecode}` })
    .send({ from: accounts[0], gas: "1000000" });

  console.log("contract deployed to address", result.options.address);
};

deploy();
