// SPDX-License-Identifier: MIT

/*
* ERC223 Token.
*/

pragma solidity ^0.8.4;

import "./ERC223Token.sol";

contract VotingToken is ERC223Token {

    constructor() ERC223Token("VotingToken", "VT", 0) {
    }

    // Voting Token can not be transfered

    function transfer(address _to, uint256 _value) public override returns (bool success){
        // Standard function transfer similar to ERC20 transfer with no _data .
        // Added due to backwards compatibility reasons .
        if (Address.isContract(_to)) {
            IERC223Recipient(_to).tokenFallback(msg.sender, _value, _empty);
        }
        return false;
    }

    function transfer(address _to, uint256 _value, bytes calldata _data) public override returns (bool success) {
        if (Address.isContract(_to)) {
            IERC223Recipient(_to).tokenFallback(msg.sender, _value, _data);
        }
        return false;
    }

    function burn(address _address, uint256 _value) public onlyRole(OWNER) {
        ERC223Token._totalSupply = SafeMath.sub(ERC223Token._totalSupply, (_value));
        ERC223Token.balances[_address] = SafeMath.sub(ERC223Token.balances[_address], (_value));
        emit Transfer(_address, address(0), _value);
    }

}