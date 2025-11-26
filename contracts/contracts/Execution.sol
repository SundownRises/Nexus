// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Vault.sol";

contract Execution is Ownable {
    mapping(address => bool) public whitelistedAgents;

    event AgentWhitelisted(address indexed agent, bool status);
    event ExecutionTriggered(address indexed agent, address indexed vault, address target, bytes data);

    constructor() Ownable(msg.sender) {}

    modifier onlyWhitelistedAgent() {
        require(whitelistedAgents[msg.sender], "Caller is not a whitelisted agent");
        _;
    }

    function setAgentStatus(address agent, bool status) external onlyOwner {
        whitelistedAgents[agent] = status;
        emit AgentWhitelisted(agent, status);
    }

    // The Agent calls this function to trigger an action in the Vault
    function executeStrategy(address payable vaultAddress, address target, bytes calldata data) external onlyWhitelistedAgent {
        Vault vault = Vault(vaultAddress);
        vault.executeTransaction(target, data);
        emit ExecutionTriggered(msg.sender, vaultAddress, target, data);
    }
}
