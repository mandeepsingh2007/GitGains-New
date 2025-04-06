// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GitGainsEscrow is ERC721URIStorage, Ownable {
    uint256 public issueCounter = 0;
    uint256 public nftCounter = 0;

    address public backendAddress; // GitHub webhook handler (off-chain)

    struct Issue {
        address payable company;
        address payable developer;
        uint256 bountyAmount;
        bool isClaimed;
    }

    mapping(uint256 => Issue) public issues;

    event IssueCreated(uint256 indexed issueId, address company, address developer, uint256 bounty);
    event IssueResolved(uint256 indexed issueId, address developer, uint256 bounty, uint256 nftId);

    constructor() ERC721("GitGainsContribution", "GGC") {}

    modifier onlyBackendOrOwner() {
        require(
            msg.sender == backendAddress || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }

    function setBackendAddress(address _backend) external onlyOwner {
        backendAddress = _backend;
    }

    function createIssue(address payable developer) external payable returns (uint256) {
        require(msg.value > 0, "Bounty must be greater than 0");

        issueCounter++;
        issues[issueCounter] = Issue(payable(msg.sender), developer, msg.value, false);

        emit IssueCreated(issueCounter, msg.sender, developer, msg.value);
        return issueCounter;
    }

    function resolveIssue(uint256 issueId, string memory nftMetadataURI) external onlyBackendOrOwner {
        Issue storage issue = issues[issueId];
        require(!issue.isClaimed, "Issue already claimed");

        issue.isClaimed = true;

        // Send bounty to developer
        issue.developer.transfer(issue.bountyAmount);

        // Mint NFT as proof of contribution
        nftCounter++;
        _mint(issue.developer, nftCounter);
        _setTokenURI(nftCounter, nftMetadataURI);

        emit IssueResolved(issueId, issue.developer, issue.bountyAmount, nftCounter);
    }

    function getIssue(uint256 issueId)
        public
        view
        returns (address company, address developer, uint256 bountyAmount, bool isClaimed)
    {
        Issue memory i = issues[issueId];
        return (i.company, i.developer, i.bountyAmount, i.isClaimed);
    }
}
