//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ETHPool {
  // IERC20 public token;

  // uint256 public constant MIN_LOCK_DURATION = 10 minutes;
  // uint256 public constant MAX_LOCK_DURATION = 365 days;

  // mapping(address => Deposit[]) public depositsOf;
  // mapping(address => uint256) public depositOf;
  // mapping(address => uint256) public pendingDepositOf;
  
  // uint256 public availableReward;
  // uint256 public lastRewardDepositTime;
  // uint256 public lastPendingDepositTime;
  // uint256 public totalDeposits;

  // uint256 public depositRewardCount;


  // struct Deposit {
  //   uint256 amount;
  //   uint64 start;
  //   uint64 end;
  // }


  // constructor(
  //       IERC20 _token
  //   ) {
  //     token = _token;
  // }


  // function depositReward(uint256 _amount) external {
  //   require(block.timestamp >= lastRewardDepositTime + 1 weeks, "ETHPool.depositReward: you can deposit again only after 1 week");

  //   token.transferFrom(msg.sender, address(this), _amount);

  //   lastRewardDepositTime = block.timestamp;
  //   availableReward += _amount;
  //   depositRewardCount++;
  // }


  // function deposit() external payable {
  //   require(msg.value > 0, "ETHPool.deposit: cannot deposit 0");

  //   // IF USER DEPOSITS ETH BEFORE TEAM DEPOSITS REWARDS, THOSE FUNDS CAN BE USED TO WITHDRAW REWARDS FOR LAST WEEK
  //   if (block.timestamp <= lastRewardDepositTime + 1 weeks) {
      
  //     depositOf[msg.sender] += msg.value + pendingDepositOf[msg.sender];
  //     totalDeposits += msg.value + pendingDepositOf[msg.sender];

  //     pendingDepositOf[msg.sender] = 0;
    
  //   // IF USER DEPOSITS ETH AFTER TEAM DEPOSITS WITHDRAW, THOSE FUNDS CAN'T BE USED TO WITHDRAW REWARDS FOR LAST WEEK
  //   // BUT FOR NEXT WEEK INSTEAD (AFTER TEAM DEPOSIT REWARDS AGAIN)
  //   } else {
  //     if (lastPendingDepositTime <= lastRewardDepositTime) {


  //     } else {

  //     }
  //     pendingDepositOf[msg.sender] += msg.value;
  //     lastPendingDepositTime = block.timestamp;
  //   }
  // }

  // function withdraw(uint256 _depositId) external {
  //   require(_depositId < depositsOf[msg.sender].length, "ETHPool.withdraw: Deposit does not exist");

  //   Deposit memory userDeposit = depositsOf[msg.sender][_depositId];

  //   // require(block.timestamp >= userDeposit.end, "TimeLockPool.withdraw: too soon");


  //   depositsOf[msg.sender][_depositId] = depositsOf[msg.sender][depositsOf[msg.sender].length - 1];
  //   depositsOf[msg.sender].pop();

  //   msg.sender.transfer(userDeposit.amount);

  // }

  
  // function claimableReward(address beneficiary) public view returns (uint256) {
  //   return;
  // }

  // function claim() external {
  //   uint256 _claimableReward = availableReward * (depositOf[msg.sender] / totalDeposits);

  //   token.transfer(msg.sender, _claimableReward);

  //   availableReward -= _claimableReward;

  //   depositOf[msg.sender] += pendingDepositOf[msg.sender];
  //   totalDeposits += pendingDepositOf[msg.sender];

  //   pendingDepositOf[msg.sender] = 0;
  // }

}