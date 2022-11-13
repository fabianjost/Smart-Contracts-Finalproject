// SPDX-License-Identifier: MIT

/*
* Standard ERC223 Token implementation.
*/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Standard ERC223 function that will handle incoming token transfers.
interface IERC223Recipient {
    function tokenFallback(
        address _from,
        uint256 _value,
        bytes calldata _data
    ) external;
}

// Utility library of inline functions on addresses
library Address {
   // Returns whether the target address is a contract
   function isContract(address account) internal view returns (bool) {
      uint256 size;
      // solhint-disable-next-line no-inline-assembly
      assembly {
         size := extcodesize(account)
      }
      return size > 0;
   }
}

contract ERC223Token is AccessControl {

   bytes32 public constant OWNER = keccak256("OWNER");

   string private _name;
   string private _symbol;
   uint8 private _decimals;
   uint256 internal _totalSupply;
   bytes constant _empty = hex"00000000";
   mapping(address => uint256) public balances; //List of user balances
   event Transfer(address indexed from, address indexed to, uint256 value);

   constructor(string memory Name, string memory Symbol, uint8 Decimals) {
      _name = Name;
      _symbol = Symbol;
      _decimals = Decimals;
      _totalSupply = 0;
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
   }

   // @dev ERC223 tokens must explicitly return.
   function standard() public pure returns (string memory) {
      return "erc223";
   }

   // @dev Returns the name of the token.
   function name() public view returns (string memory) {
      return _name;
   }

   // @dev Returns the symbol of the token, usually a shorter veriosn of the name.
   function symbol() public view returns (string memory) {
      return _symbol;
   }

   // @dev  Returns the number of decimals used to get its user representation.
   // E.g. if decimals=2, a balance of `505` tokens should be displayed to a user as `5,05` (`505 / 10^decimals`)
   function decimals() public view returns (uint8) {
      return _decimals;
   }

   // @dev Returns total supply of the token.
   function totalSupply() public view returns (uint256) {
      return _totalSupply;
   }

   // @dev Returns balance of the owner.
   function balanceOf(address owner) public view returns (uint256) {
      return balances[owner];
   }

   function transfer(address _to, uint256 _value) public virtual returns (bool success){
        // Standard function transfer similar to ERC20 transfer with no _data .
        // Added due to backwards compatibility reasons .
        balances[msg.sender] = SafeMath.sub(balances[msg.sender], _value);
        balances[_to] = SafeMath.add(balances[_to], _value);
        if (Address.isContract(_to)) {
            IERC223Recipient(_to).tokenFallback(msg.sender, _value, _empty);
        }
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transfer(address _to, uint256 _value, bytes calldata _data) public virtual returns (bool success) {
        balances[msg.sender] = SafeMath.sub(balances[msg.sender], _value);
        balances[_to] = SafeMath.add(balances[_to], _value);
        if (Address.isContract(_to)) {
            IERC223Recipient(_to).tokenFallback(msg.sender, _value, _data);
        }
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function mint(address account, uint256 value) public onlyRole(OWNER) returns (bool success) {
        require(account != address(0));
        _totalSupply = SafeMath.add(_totalSupply, (value));
        balances[account] = SafeMath.add(balances[account], (value));
        emit Transfer(address(0), account, value);
        return true;
    }

   function burn(uint256 value) public {
        _totalSupply = SafeMath.sub(_totalSupply, (value));
        balances[msg.sender] = SafeMath.sub(balances[msg.sender], (value));
        emit Transfer(msg.sender, address(0), value);
    }
}
