// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault is Ownable {
    address public executionContract;
    uint256 public maxAllocatedPercentage = 20; // Default 20%
    uint256 public maxSlippage = 50; // Default 0.5% (basis points)

    event Deposited(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event StrategyExecuted(address indexed target, bytes data);
    event RiskParamsUpdated(uint256 maxAllocatedPercentage, uint256 maxSlippage);

    constructor(address _executionContract) Ownable(msg.sender) {
        executionContract = _executionContract;
    }

    modifier onlyExecution() {
        require(msg.sender == executionContract, "Caller is not the execution contract");
        _;
    }

    function setExecutionContract(address _executionContract) external onlyOwner {
        executionContract = _executionContract;
    }

    function setRiskParams(uint256 _maxAllocatedPercentage, uint256 _maxSlippage) external onlyOwner {
        require(_maxAllocatedPercentage <= 100, "Percentage > 100");
        maxAllocatedPercentage = _maxAllocatedPercentage;
        maxSlippage = _maxSlippage;
        emit RiskParamsUpdated(_maxAllocatedPercentage, _maxSlippage);
    }

    function deposit(address token, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, token, amount);
    }

    function withdraw(address token, uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        IERC20(token).transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, token, amount);
    }

    // Allows the Execution contract to invoke arbitrary logic on behalf of the Vault
    // e.g. approving tokens for swapping, or calling a router
    function executeTransaction(address target, bytes calldata data) external onlyExecution returns (bytes memory) {
        // Basic risk check: Ensure we aren't spending more than allowed percentage of balance
        // Note: This is a simplified check. Real implementation would parse 'data' to find value/amount.
        // For MVP, we rely on the agent to respect this, but we store it on-chain for visibility.
        
        (bool success, bytes memory result) = target.call(data);
        require(success, "Transaction execution failed");
        emit StrategyExecuted(target, data);
        return result;
    }
}
