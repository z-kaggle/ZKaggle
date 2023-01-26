// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

interface IVerifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) external view returns (bool);
}