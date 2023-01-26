// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "./IVerifier.sol";
import "hardhat/console.sol";

contract CID {

    IVerifier public verifier;

    uint8 public constant CID_VERSION = 1;
    uint8 public constant CID_CODEC = 0x55; // for raw buffer
    uint8 public constant CID_HASH = 0x12; // for sha256
    uint8 public constant CID_LENGTH = 32; // for sha256

    constructor(address _verifier) {
        verifier = IVerifier(_verifier);
    }
    
    function computeCID(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) public view returns (bytes memory) {
        require(verifier.verifyProof(a, b, c, input), "Invalid proof");
        
        uint digest = (input[2] << 128) + input[3];
        return abi.encodePacked(CID_VERSION, CID_CODEC, CID_HASH, CID_LENGTH, digest);
    }

}