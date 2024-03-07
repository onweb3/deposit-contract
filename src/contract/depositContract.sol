// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DepositContract is Ownable, ReentrancyGuard {
    IERC20 private erc20Token;
    mapping(address => uint256) private deposits;
    address[] private depositors;

    event Deposit(address indexed depositor, uint256 amount);
    event Withdrawal(address indexed owner, uint256 amount);

    constructor(address _erc20Token, address _initialOwner) Ownable(_initialOwner) {
        erc20Token = IERC20(_erc20Token);
    }

  function deposit(uint256 amount) external nonReentrant payable {
        require(amount > 0, "Deposit amount must be greater than 0");

        // Ensure the contract has been approved to spend the user's tokens
        require(erc20Token.allowance(msg.sender, address(this)) >= amount, "Not enough allowance");

        // Transfer ERC20 tokens from the user to the contract
        require(erc20Token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        // Update the deposits mapping
        deposits[msg.sender] += amount;

        // Update the list of depositors if the depositor is not already in the list
        if (deposits[msg.sender] == amount) {
            depositors.push(msg.sender);
        }

        // Emit the Deposit event
        emit Deposit(msg.sender, amount);
    }
    function getDepositAmount(address depositor) external view returns (uint256) {
        return deposits[depositor];
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(amount <= erc20Token.balanceOf(address(this)), "Insufficient balance");

        require(erc20Token.transfer(owner(), amount), "Token transfer failed");

        emit Withdrawal(owner(), amount);
    }


       function getNumDepositors() external view returns (uint256) {
        return depositors.length;
    }

    function getDepositorAtIndex(uint256 index) external view returns (address) {
        require(index < depositors.length, "Index out of bounds");
        return depositors[index];
    }

    function getAllDepositors() external view returns (address[] memory) {
        return depositors;
    }
    function getDepositedAmount(address depositor) external view returns (uint256) {
    // Return the deposited amount for the specified depositor
    return deposits[depositor];
    }

}
