// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./DAOToken.sol";
import "./VotingToken.sol";

/** 
  *@title Locking contract to lock DAOTokens and wrap them in voting tokens
*/

contract Locker is ReentrancyGuard {

    VotingToken public VotingTokenContract;
    DAOToken public DAOTokenContract;
    struct Entry {
        uint256 unlockTime;
        uint256 amount;
    }
    mapping(address => Entry[]) locked;
    event Lock(address _address, uint256 amount, uint256 lockDays);
    event Unlock(address _address, uint256 amount);

    constructor(address DAOTokenAddress, address VotingTokenAddress) payable {
      VotingTokenContract = VotingToken(VotingTokenAddress);
      DAOTokenContract = DAOToken(DAOTokenAddress);
    }

    //function to lock tokens and mint correspoding voting tokens plus additional DAOTokens
    //based on the locking time
    //note: normally the minimum locking days would need to be the voting time for the proposals, to prevent multiple votes from the same person
    function lock(uint256 _lockAmount, uint256 _lockTime) public payable nonReentrant returns (bool success) {
        require(_lockAmount != 0);
        require(_lockTime > 0 && _lockTime <= 31622400, "Lock time must be between 0 and 366 days!"); //Normally it should be between 14 and 366 days
        require((DAOTokenContract.balanceOf(msg.sender) - DAOTokenContract.frozenBalanceOf(msg.sender)) >= _lockAmount, "Insufficient balance!");
        uint256 lockDays = SafeMath.div(_lockTime, 86400);                         //Calculate locking time from seconds to days
        uint256 unlockTimestamp = SafeMath.add(block.timestamp, _lockTime);        //Calculate unlocking time
        uint256 multiplier = SafeMath.mul(SafeMath.div(1000000, 365), lockDays);   //Multiplier for additional tokens, 365days = 2x
        uint256 amount = SafeMath.div(SafeMath.mul(SafeMath.add(1000000, multiplier), _lockAmount), 1000000);    //Calculate new amount based on locking time
        Entry memory entry = Entry(unlockTimestamp, amount);
        locked[msg.sender].push(entry);
        uint256 newDaoTokens = SafeMath.sub(amount, _lockAmount);
        DAOTokenContract.mint(msg.sender, newDaoTokens);
        DAOTokenContract.freeze(msg.sender, amount);
        VotingTokenContract.mint(msg.sender, amount);
        emit Lock(msg.sender, amount, _lockTime);
        return true;
    }

    //function to unlock tokens
    //only possible if unlock time has bee reached
    function unlock(uint256 _amount) public nonReentrant returns (bool success) {
        require(DAOTokenContract.balanceOf(msg.sender) >= _amount, "Insufficient balance!");
        uint256 unlockedTokens = unlockedAmount(msg.sender);
        require(unlockedTokens >= _amount, "Not enough tokens unlockable!");
        VotingTokenContract.burn(msg.sender, _amount);
        DAOTokenContract.unfreeze(msg.sender, _amount);
        updateUnlockAmount(_amount);
        emit Unlock(msg.sender, _amount);
        return true;
    }

    function updateUnlockAmount(uint256 _amount) internal {
        uint256 unlocked = 0;
        uint256 i = 0;
        uint256 currentTime = block.timestamp;
        while (unlocked < _amount) {
            if (locked[msg.sender][i].unlockTime > currentTime) {
                i++;
                continue;
            }
            uint256 oldAmount = locked[msg.sender][i].amount;
            locked[msg.sender][i].amount = subFloor(oldAmount, SafeMath.sub(_amount, unlocked));
            unlocked = SafeMath.add(unlocked,SafeMath.sub(oldAmount, locked[msg.sender][i].amount));
            i++;
        }
    }

    function subFloor(uint256 a, uint256 b) internal pure returns (uint256) {
        if (b >= a) {
            return 0;
        } else {
            uint256 c = a - b;
            return c;
        }
    }

    //returns amount of tokens can be unlocked
    function unlockedAmount(address _address) public view returns (uint256) {
        uint256 currentTime = block.timestamp;
        uint256 amount = 0;
        for (uint256 i = 0; i < locked[_address].length; i++) {
            if (locked[msg.sender][i].unlockTime > currentTime) {
                continue;
            }
            amount = SafeMath.add(amount, locked[msg.sender][i].amount);
        }
        return amount;
    }

    //total locked tokens
    function totalLocked() public view returns (uint256) {
        return VotingTokenContract.totalSupply();
    }

    //returns unlocktime and amount as array of Entry structs
    function unlockTime(address _address) public view returns (Entry[] memory) {
        return locked[_address];
    }
}