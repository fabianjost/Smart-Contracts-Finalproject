// SPDX-License-Identifier: MIT

/*
* ERC223 Token.
*/

pragma solidity ^0.8.4;

import "./ERC223Token.sol";

contract DAOToken is ERC223Token {

    mapping(address => uint256) public frozen; //List of users that saves address, unlockTime, frozen amount
    event Freeze(address indexed owner, uint256 amount);
    event Unfreeze(address indexed owner, uint256 amount);

    constructor() ERC223Token("DAOToken", "DT", 0) {
    }

    function freeze(address _address, uint256 _amount) public onlyRole(OWNER) {
        frozen[_address] = SafeMath.add(frozen[_address], _amount);
        emit Freeze(_address, _amount);
    }

    function unfreeze(address _address, uint256 _amount) public onlyRole(OWNER) {
        frozen[_address] = SafeMath.sub(frozen[_address], _amount);
        emit Unfreeze(_address, _amount);
    }

    function frozenBalanceOf(address owner) public view returns (uint256) {
      return frozen[owner];
   }

    function transfer(address _to, uint256 _value) public override returns (bool success){
        // Standard function transfer similar to ERC20 transfer with no _data .
        // Added due to backwards compatibility reasons .
        require(SafeMath.sub(balances[msg.sender], frozen[msg.sender]) >= _value, "Your balance is frozen!");
        ERC223Token.balances[msg.sender] = SafeMath.sub(ERC223Token.balances[msg.sender], _value);
        ERC223Token.balances[_to] = SafeMath.add(ERC223Token.balances[_to], _value);
        if (Address.isContract(_to)) {
            IERC223Recipient(_to).tokenFallback(msg.sender, _value, _empty);
        }
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transfer(address _to, uint256 _value, bytes calldata _data) public override returns (bool success) {
        require(SafeMath.sub(balances[msg.sender], frozen[msg.sender]) >= _value, "Your balance is frozen!");
        ERC223Token.balances[msg.sender] = SafeMath.sub(ERC223Token.balances[msg.sender], _value);
        ERC223Token.balances[_to] = SafeMath.add(ERC223Token.balances[_to], _value);
        if (Address.isContract(_to)) {
            IERC223Recipient(_to).tokenFallback(msg.sender, _value, _data);
        }
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

}