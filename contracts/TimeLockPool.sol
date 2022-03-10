// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./base/BasePool.sol";
import "./interfaces/ITimeLockPool.sol";

contract TimeLockPool is BasePool, ITimeLockPool {
    using Math for uint256;
    using SafeERC20 for IERC20;
    
    mapping(address => uint256) public depositOf;

    event Deposited(uint256 amount, address indexed receiver);
    event Withdrawn(address indexed receiver, uint256 amount);

    constructor(
        string memory _name,
        string memory _symbol,
        address _rewardToken
    ) BasePool(_name, _symbol, _rewardToken) {}

    function deposit() external payable override {
      require(msg.value > 0, "TimeLockPool.deposit: cannot deposit 0");

      depositOf[_msgSender()] += msg.value;

      _mint(_msgSender(), msg.value);
      emit Deposited(msg.value, _msgSender());
    }

    function withdraw() external {
      require(depositOf[_msgSender()] > 0, "TimeLockPool.withdraw: Deposit does not exist");

      uint256 userDeposit = depositOf[_msgSender()];
      depositOf[_msgSender()] = 0;

      // burn pool shares
      _burn(_msgSender(), userDeposit);
      // return ETH
      payable(_msgSender()).transfer(userDeposit);

      emit Withdrawn(_msgSender(), userDeposit);
    }

    function getDepositOf(address _account) public view returns(uint256) {
      return depositOf[_account];
    }

}