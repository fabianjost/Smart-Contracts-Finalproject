const truffleAssert = require('truffle-assertions');

const ICO_DAOToken = artifacts.require("ICO_DAOToken");

contract("ICO_DAOToken test", async accounts => {
  let owner = accounts[0];
  let user = accounts[1];

  it("token should be buyable", async () => {
    let instance = await ICO_DAOToken.deployed();
    let amount1 = (await instance._totalSupply.call()).toNumber();
    let price = (await instance.price.call()).toNumber();
    let result = await instance.buy({from: user, value: 100*price});
    truffleAssert.eventEmitted(result, 'Buy');
    let amount2 = (await instance._totalSupply.call()).toNumber();
    assert.equal(amount2 - amount1, 100);
  });

  it("price should increase after 1000 and 2000 tokens sold", async () => {
    let instance = await ICO_DAOToken.deployed();
    let price1 = (await instance.price.call()).toNumber();
    assert.equal(price1, 10);
    let totalSupply = (await instance._totalSupply.call()).toNumber();
    let result1 = await instance.buy({from: user, value: ((999-totalSupply)*price1)});
    let price2 = (await instance.price.call()).toNumber();
    assert.equal(price1, price2);
    truffleAssert.eventEmitted(result1, 'Buy');

    let result2 = await instance.buy({from: user, value: 1*price1});
    let price3 = (await instance.price.call()).toNumber();
    assert.equal(price3, 20);
    truffleAssert.eventEmitted(result2, 'Buy');

    let result3 = await instance.buy({from: user, value: 1200*price3});
    let price4 = (await instance.price.call()).toNumber();
    assert.equal(price4, 40);
    truffleAssert.eventEmitted(result3, 'Buy');    
  });

  it("ico should end after specified amount has been sold", async () => {
    let instance = await ICO_DAOToken.deployed();
    let price = (await instance.price.call()).toNumber();
    let buy = await instance.buy({from: user, value: (price * 4000)});
    truffleAssert.eventEmitted(buy, 'Buy');
    await truffleAssert.reverts(instance.buy({from:user, value: 1*price}));
  });

});

