const { shouldThrow, increaseTime, duration } = require("./helpers");
const expect = require("chai").expect;

const CryptoZombies = artifacts.require("CryptoZombies");

const zombieNames = ["Zombie 1", "Zombie 2"];

contract("CryptoZombies", (accounts) => {
  let [alice, bob] = accounts;

  let contractInstance;

  beforeEach(async () => {
    contractInstance = await CryptoZombies.new();

    // contractInstance.defaults({ gasPrice: 0 }); // to avoid running out of gas
  });

  afterEach(async () => {
    await contractInstance.kill();
  });

  it("should be able to create a new zombie", async () => {
    const result = await contractInstance.createRandomZombie(zombieNames[0], { from: alice });

    expect(result.receipt.status).to.equal(true);
    expect(result.logs[0].args.name).to.equal(zombieNames[0]);
  });

  it("should not allow two zombies", async () => {
    await contractInstance.createRandomZombie(zombieNames[0], { from: alice });
    shouldThrow(contractInstance.createRandomZombie(zombieNames[1], { from: alice }));
  });

  context("with the single-step transfer scenario", async () => {
    it("should transfer a zombie", async () => {
      const result = await contractInstance.createRandomZombie(zombieNames[0], { from: alice });
      const zombieId = result.logs[0].args.zombieId.toNumber();
      await contractInstance.transfer(bob, zombieId, { from: alice });
      const newOwner = await contractInstance.ownerOf(zombieId);
      expect(newOwner).to.equal(bob);
    });
  });

  context("with the two-step transfer scenario", async () => {
    it("should approve and then transfer a zombie when the approved address calls takeOwnership", async () => {
      const result = await contractInstance.createRandomZombie(zombieNames[0], { from: alice });
      const zombieId = result.logs[0].args.zombieId.toNumber();
      await contractInstance.approve(bob, zombieId, { from: alice });
      await contractInstance.takeOwnership(zombieId, { from: bob });
      const newOwner = await contractInstance.ownerOf(zombieId);
      expect(newOwner).to.equal(bob);
    });
  });

  it("zombies should be able to attack another zombie", async () => {
    let result = await contractInstance.createRandomZombie(zombieNames[0], { from: alice });
    const firstZombieId = result.logs[0].args.zombieId.toNumber();
    result = await contractInstance.createRandomZombie(zombieNames[1], { from: bob });
    const secondZombieId = result.logs[0].args.zombieId.toNumber();

    await increaseTime(duration.days(1)); // avoiding the zombie cooldown

    await contractInstance.attack(firstZombieId, secondZombieId, { from: alice });
    expect(result.receipt.status).to.equal(true);
  });
});
