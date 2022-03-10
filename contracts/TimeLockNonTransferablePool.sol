// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./TimeLockPool.sol";

contract TimeLockNonTransferablePool is TimeLockPool {
  constructor(
      string memory _name,
      string memory _symbol,
      address _rewardToken
  ) TimeLockPool(_name, _symbol, _rewardToken) { }

  // disable transfers
  function _transfer(address _from, address _to, uint256 _amount) internal pure override {
    revert("NON_TRANSFERABLE");
  }
}