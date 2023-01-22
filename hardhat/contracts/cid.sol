// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "./verifier.sol";
import "hardhat/console.sol";

contract CID is Verifier {
    
    function computeCID(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[4] memory input
    ) public view returns (bytes memory) {
        require(verifyProof(a, b, c, input), "Invalid proof");
        
        uint digest = (input[2] << 128) + input[3];
        return abi.encodePacked(digest);

        // TODO: compute and return the CID
    }

}