const shouldThrow = async (promise) => {
  try {
    await promise;
  } catch (err) {
    return assert(true);
  }

  assert(false);
};

const increaseTime = async (duration) => {
  // to trick the time has passed, we increase the time, then mine a new block,
  // so when checking the date, evm will see the last block's timestamp

  // first, let's increase time
  await new Promise((res, rej) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [duration], // there are 86400 seconds in a day
        id: new Date().getTime(),
      },
      (err, result) => {
        if (err) return rej(err);
        res(result);
      }
    );
  });

  await new Promise((res, rej) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        params: [],
        id: new Date().getTime(),
      },
      (err, result) => {
        if (err) return rej(err);
        res(result);
      }
    );
  });
};

const duration = {
  seconds: function (val) {
    return val;
  },
  minutes: function (val) {
    return val * this.seconds(60);
  },
  hours: function (val) {
    return val * this.minutes(60);
  },
  days: function (val) {
    return val * this.hours(24);
  },
};

module.exports = { shouldThrow, increaseTime, duration };
