// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "./verifier.sol";
import "hardhat/console.sol";

contract CID is Verifier {

    uint8 public constant CID_VERSION = 1;
    uint8 public constant CID_CODEC = 0x55; // for raw buffer
    uint8 public constant CID_HASH = 0x12; // for sha256
    uint8 public constant CID_LENGTH = 32; // for sha256
    
    function computeCID(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[4] memory input
    ) public view returns (bytes memory) {
        require(verifyProof(a, b, c, input), "Invalid proof");
        
        uint digest = (input[2] << 128) + input[3];
        return abi.encodePacked(CID_VERSION, CID_CODEC, CID_HASH, CID_LENGTH, digest);
    }

}