// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "./Bounty.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract BountyFactory {
    address public immutable bountyTemplate;
    address[] public bounties;
    uint public bountyCount;
    address[] public bountyOwners;

    event BountyCreated(address indexed bounty);

    constructor() {
        bountyTemplate = address(new Bounty());
    }

    function createBounty(
        string memory _name,
        string memory _description,
        bytes memory _dataCID
    ) public payable returns (address) {
        require(msg.value > 0, "BountyFactory: must send more than 0 wei to create bounty");
        address clone = Clones.clone(bountyTemplate);
        Bounty(clone).initialize{value: msg.value}(msg.sender, _name, _description, _dataCID);
        bounties.push(clone);
        bountyOwners.push(msg.sender);
        emit BountyCreated(clone);
        bountyCount++;
        return clone;
    }
}