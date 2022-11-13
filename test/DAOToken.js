const truffleAssert = require('truffle-assertions');
const keccak256 = require('keccak256');

const DAOToken = artifacts.require("DAOToken");
const ICO_DAOToken = artifacts.require("ICO_DAOToken");
const Locker = artifacts.require("Locker");

contract("DAOToken test", async accounts => {
  let owner = accounts[0];
  let user = accounts[1];

  it("should be indivisible", async () => {
    let instance = await DAOToken.deployed();
    let decimals = await (instance.decimals.call()).valueOf();
    assert.equal(decimals, 0);
  });

  it("token should be mintable by ico contract", async () => {
    let instance = await DAOToken.deployed();
    let icoInstance = await ICO_DAOToken.deployed();
    let amount1 = (await instance.totalSupply.call()).toNumber();
    let price = (await icoInstance.price.call()).toNumber();
    let result = await icoInstance.buy({from: user, value: 100*price});
    truffleAssert.eventEmitted(result, 'Buy');
    let amount2 = (await instance.totalSupply.call()).toNumber();
    assert.equal(amount2 - amount1, 100);
  });

  it("should not be mintable by someone else", async () => {
    let instance = await DAOToken.deployed();
    await truffleAssert.reverts(instance.mint(owner, 100, {'from': user}));
  });

  it("should be burnable", async () => {
    let instance = await DAOToken.deployed();
    let icoInstance = await ICO_DAOToken.deployed();
    let price = (await icoInstance.price.call()).toNumber();
    await icoInstance.buy({from: user, value: 100*price});
    let amount1 = (await instance.balanceOf.call(user)).toNumber();
    await instance.burn(100, {'from': accounts[1]});
    let amount2 = (await instance.balanceOf.call(user)).toNumber();
    assert.equal(amount1 - amount2, 100);
  });

  it("tokens are transferred correctly", async () => {
    let instance = await DAOToken.deployed();
    let icoInstance = await ICO_DAOToken.deployed();
    let price = (await icoInstance.price.call()).toNumber();
    await icoInstance.buy({from: owner, value: 100*price});
    let balanceBefore = (await instance.balanceOf(user)).toNumber();
    let tx = await instance.transfer(user, 50, {'from': owner});
    truffleAssert.eventEmitted(tx, 'Transfer');
    let balanceAfter = (await instance.balanceOf(user)).toNumber();
    assert.equal(balanceAfter - balanceBefore, 50)
  });

  it("token should be freezable by the locking contract", async () => {
    let instance = await DAOToken.deployed();
    let icoInstance = await ICO_DAOToken.deployed();
    let lockerInstance = await Locker.deployed();
    let price = (await icoInstance.price.call()).toNumber();
    let result = await icoInstance.buy({from: user, value: 10*price});
    truffleAssert.eventEmitted(result, 'Buy');
    let lock = await lockerInstance.lock(5, 1, {from: user});
    truffleAssert.eventEmitted(lock, 'Lock');
    let frozenBalance = (await instance.frozenBalanceOf(user)).toNumber();
    assert.equal(frozenBalance, 5);
  });

  it("tokens should be unfreezable by the locking contract", async () => {
    let instance = await DAOToken.deployed();
    let lockerInstance = await Locker.deployed();
    let frozenBalanceBefore = (await instance.frozenBalanceOf(user)).toNumber();
    let unlock = await lockerInstance.unlock(5, {from: user});
    truffleAssert.eventEmitted(unlock, 'Unlock');
    let frozenBalanceAfter = (await instance.frozenBalanceOf(user)).toNumber();
    assert.equal(frozenBalanceAfter, frozenBalanceBefore-5);
  });

  it("frozen tokens cannot be transfered, but unfrozen can", async () => {
    let instance = await DAOToken.deployed();
    let lockerInstance = await Locker.deployed();
    let balanceBefore = (await instance.balanceOf(user)).toNumber();
    let lock = await lockerInstance.lock(5, 1, {from:user});
    truffleAssert.eventEmitted(lock, 'Lock');
    await truffleAssert.reverts(instance.transfer(owner, balanceBefore, {'from': user}));
    let transfer = await instance.transfer(owner, 5, {'from': user});
    truffleAssert.eventEmitted(transfer, 'Transfer');
    let unlock = await lockerInstance.unlock(5, {'from': user});
    truffleAssert.eventEmitted(unlock, 'Unlock');
    let balanceAfter = (await instance.balanceOf(user)).toNumber();
    assert.equal(balanceAfter, balanceBefore-5);
    transfer = await instance.transfer(owner, balanceAfter, {'from': user});
    truffleAssert.eventEmitted(transfer, 'Transfer');
    assert.equal((await instance.balanceOf(user)).toNumber(), 0);
  });

});

