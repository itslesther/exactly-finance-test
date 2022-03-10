//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20Pausable, Ownable {

    // uint256 constant public MAX_SUPPLY = 160_000_000e18;

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply)
        ERC20(_name, _symbol)
    {
        _mint(_msgSender(), _totalSupply);
    }

    function mint(address _receiver, uint256 _amount) external onlyOwner {
        _mint(_receiver, _amount);
    }

    function burn(uint256 amount) external {
        _burn(_msgSender(), amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
