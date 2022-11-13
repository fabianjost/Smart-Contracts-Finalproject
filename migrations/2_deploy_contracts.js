const keccak256 = require('keccak256');
const DAOToken = artifacts.require("DAOToken");
const VotingToken = artifacts.require("VotingToken");
const ICO_DAOToken = artifacts.require("ICO_DAOToken");
const Locker = artifacts.require("Locker");
const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
  let admin = '0x1e579C30Cd42Cb2606287A07c1dDFf36515Ce3F0';
  let maintainer = '0x1e579C30Cd42Cb2606287A07c1dDFf36515Ce3F0';
  deployer.deploy(DAOToken).then(() => {
    return deployer.deploy(VotingToken).then(() => {
      return deployer.deploy(ICO_DAOToken, DAOToken.address).then(() => {
        return deployer.deploy(Locker, DAOToken.address, VotingToken.address).then(async () => {
          return deployer.deploy(Voting, VotingToken.address, admin, maintainer).then(async () => {
            var daoTokenInstance = await DAOToken.deployed();
            await daoTokenInstance.grantRole(keccak256("OWNER"), ICO_DAOToken.address);
            await daoTokenInstance.grantRole(keccak256("OWNER"), Locker.address);
            var votingTokenInstance = await VotingToken.deployed();
            await votingTokenInstance.grantRole(keccak256("OWNER"), Locker.address);
          })
        })
      })
    })    
  })
};