// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentRegistry is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    event AgentRegistered(uint256 indexed agentId, address indexed owner, string tokenURI);

    constructor() ERC721("NexusAgent", "NXA") Ownable(msg.sender) {}

    function registerAgent(string memory tokenURI) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit AgentRegistered(tokenId, msg.sender, tokenURI);
        return tokenId;
    }
}
