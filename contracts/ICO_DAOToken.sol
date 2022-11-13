// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import from node_modules @openzeppelin/contracts v4.0
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./DAOToken.sol";

/** 
  *@title Initial Coin Offerring(ICO) contract
*/

contract ICO_DAOToken is ReentrancyGuard, Ownable {

    DAOToken public DAOTokenContract;

    bool public inProcess;
    uint256 maxPreorderAmountPerUser = 5000;
    uint8 public constant PRESALE_PRICE = 10;
    uint8 public constant ICO_PRICE1 = 20;
    uint8 public constant ICO_PRICE2 = 40;
    uint16 public constant PRESALE_TOKEN_SUPPLY_LIMIT = 1000;
    uint16 public constant ICO_TOKEN_SUPPLY_LIMIT = 2000;
    uint16 public constant ICO2_TOKEN_SUPPLY_LIMIT = 4000;
    uint8 public price = PRESALE_PRICE;
    uint256 public _totalSupply;

    event Buy(address indexed to, uint256 amount);
    
    constructor(address _address) payable {
      inProcess = true;
      DAOTokenContract = DAOToken(_address);
      _totalSupply = 0;
    }
    
    function startICO() public onlyOwner {
        inProcess = true;
    }

    function stopICO() public onlyOwner {
        inProcess = false;
    }

    modifier _inProcess() {
      require(inProcess == true, "ICO is over!");
      _;
    }

    /** 
      @dev function to buy token with ether
    */
    function buy() public payable nonReentrant _inProcess returns (bool success) {
      require(msg.sender.balance >= msg.value && msg.value != 0 ether, "ICO: function buy invalid input");
      require(DAOTokenContract.balanceOf(msg.sender) < maxPreorderAmountPerUser, "User reached max preorder amount");
      require(msg.value >= price, "Minimum buy quantity is 1 token");
      uint256 startingAmount = _totalSupply;
      uint256 amount = mintAndUpdatePrice(uint256(msg.value));
      _totalSupply = SafeMath.add(_totalSupply, amount);
      DAOTokenContract.mint(msg.sender, amount);

      emit Buy(msg.sender, _totalSupply - startingAmount);
      return true;
    }

    function getBuyPrice() public view returns(uint) {
        return price;
    }

    function mintAndUpdatePrice(uint256 _value) internal _inProcess returns (uint256 amount) {
      uint256 dif;
      if (_totalSupply < PRESALE_TOKEN_SUPPLY_LIMIT) {
        amount = SafeMath.div(_value, price);
        if ((SafeMath.add(amount, _totalSupply)) >= PRESALE_TOKEN_SUPPLY_LIMIT) {
          dif = SafeMath.sub(PRESALE_TOKEN_SUPPLY_LIMIT, _totalSupply);
          _totalSupply = SafeMath.add(_totalSupply, dif);
          DAOTokenContract.mint(msg.sender, dif);
          dif = SafeMath.mul(dif, price);
          price = ICO_PRICE1;
          amount = mintAndUpdatePrice(SafeMath.sub(_value, dif));
        }
      } else if (_totalSupply < ICO_TOKEN_SUPPLY_LIMIT) {
        amount = SafeMath.div(_value, price);
        if ((SafeMath.add(amount, _totalSupply)) >= ICO_TOKEN_SUPPLY_LIMIT) {
          dif = SafeMath.sub(ICO_TOKEN_SUPPLY_LIMIT, _totalSupply);
          _totalSupply = SafeMath.add(_totalSupply, dif);
          DAOTokenContract.mint(msg.sender, dif);
          dif = SafeMath.mul(dif, price);
          price = ICO_PRICE2;
          amount = mintAndUpdatePrice(SafeMath.sub(_value, dif));
        }
      } else if (_totalSupply < ICO2_TOKEN_SUPPLY_LIMIT) {
        amount = SafeMath.div(_value, price);
        if ((SafeMath.add(amount, _totalSupply)) >= ICO2_TOKEN_SUPPLY_LIMIT) {
          dif = SafeMath.sub(ICO2_TOKEN_SUPPLY_LIMIT, _totalSupply);
          _totalSupply = SafeMath.add(_totalSupply, dif);
          DAOTokenContract.mint(msg.sender, dif);
          inProcess = false;
          amount = 0;
        }
      } else {
        amount = 0;
      }
      return amount;
    }

    /**
      @dev function use to withdraw ether from contract
    */
    function withdraw(uint256 amount) public onlyOwner returns (bool success) {
      require(amount <= address(this).balance, "ICO: function withdraw invalid input");
      (success, ) = payable(_msgSender()).call{value: amount}("");
      return true;
    }

    receive() external payable {
      buy();
    }
}