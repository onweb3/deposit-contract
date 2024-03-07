// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDToken is ERC20 {
    address public owner;

    constructor() ERC20("MockUSDToken", "USD") {
        owner = msg.sender;
        _mint(msg.sender, 1_000_000 * 10**decimals()); // Mint 1 million USD tokens to the contract creator
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount);
    }
}
