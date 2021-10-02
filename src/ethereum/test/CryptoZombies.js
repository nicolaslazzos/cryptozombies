const { shouldThrow, increaseTime, duration } = require("./helpers");

const CryptoZombies = artifacts.require("CryptoZombies");

const zombieNames = ["Zombie 1", "Zombie 2"];

contract("CryptoZombies", (accounts) => {
  let [alice, bob] = accounts;

  let contractInstance;

  beforeEach(async () => {
    contractInstance = await CryptoZombies.new();
  });

  afterEach(async () => {
    await contractInstance.kill();
  });

  it("should be able to create a new zombie", async () => {
    const result = await contractInstance.createRandomZombie(zombieNames[0], { from: alice });

    assert.equal(result.receipt.status, true);
    assert.equal(result.logs[0].args.name, zombieNames[0]);
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
      assert.equal(newOwner, bob);
    });
  });

  context("with the two-step transfer scenario", async () => {
    it("should approve and then transfer a zombie when the approved address calls takeOwnership", async () => {
      const result = await contractInstance.createRandomZombie(zombieNames[0], { from: alice });
      const zombieId = result.logs[0].args.zombieId.toNumber();
      await contractInstance.approve(bob, zombieId, { from: alice });
      await contractInstance.takeOwnership(zombieId, { from: bob });
      const newOwner = await contractInstance.ownerOf(zombieId);
      assert.equal(newOwner, bob);
    });
  });

  it("zombies should be able to attack another zombie", async () => {
    let result = await contractInstance.createRandomZombie(zombieNames[0], { from: alice });
    const firstZombieId = result.logs[0].args.zombieId.toNumber();
    result = await contractInstance.createRandomZombie(zombieNames[1], { from: bob });
    const secondZombieId = result.logs[0].args.zombieId.toNumber();

    await increaseTime(duration.days(1)); // avoiding the zombie cooldown

    await contractInstance.attack(firstZombieId, secondZombieId, { from: alice });
    assert.equal(result.receipt.status, true);
  });
});
