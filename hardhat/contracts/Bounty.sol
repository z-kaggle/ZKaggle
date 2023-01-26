// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IVerifier.sol";

contract Bounty is Ownable {
    
    // take owner address from factory
    constructor(address _owner) Ownable() {
        transferOwnership(_owner);
    }

    // TODO: many functions here
}