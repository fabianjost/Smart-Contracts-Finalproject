const truffleAssert = require('truffle-assertions');

const ICO_DAOToken = artifacts.require("ICO_DAOToken");
const Locker = artifacts.require("Locker");
const Voting = artifacts.require("Voting");

contract("Voting test", async accounts => {
  let owner = accounts[0];
  let user = accounts[1];

  it("User can propose", async () => {
    let icoInstance = await ICO_DAOToken.deployed();
    let lockerInstance = await Locker.deployed();
    let votingInstance = await Voting.deployed();
    let price = (await icoInstance.price.call()).toNumber();
    await icoInstance.buy({from: user, value: 100*price});
    await lockerInstance.lock(10, 600, {from: user});
    let data = "test";
    await votingInstance.propose.call(data, {from: user});
  });

});