const truffleAssert = require('truffle-assertions');

const ICO_DAOToken = artifacts.require("ICO_DAOToken");
const Locker = artifacts.require("Locker");

contract("Locker test", async accounts => {
  let owner = accounts[0];
  let user = accounts[1];

  it("newly locked tokens, with shorter locking time should be unlockable when longer locking time has been set before for other tokens", async () => {
    let icoInstance = await ICO_DAOToken.deployed();
    let lockerInstance = await Locker.deployed();
    let price = (await icoInstance.price.call()).toNumber();
    let result = await icoInstance.buy({from: user, value: 100*price});
    truffleAssert.eventEmitted(result, 'Buy');
    await lockerInstance.lock(10,600, {from: user});
    await lockerInstance.lock(10, 1, {from: user});
    await lockerInstance.lock(10, 1, {from: user});
    await lockerInstance.unlock(10, {from: user});
  });

});