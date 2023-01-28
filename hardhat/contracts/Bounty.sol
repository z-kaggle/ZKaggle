// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IVerifier.sol";

contract Bounty is Ownable {
    // variables set by bounty provier at Tx 1 (constructor)
    string public name;
    string public description;
    bytes public dataCID;
    // reward amount is not stored, use contract balance instead

    // variables set by bounty hunter at Tx 2
    bytes public zkeyCID;
    bytes public circomCID;
    IVerifier public verifier;
    uint[2] public a;
    uint[2][2] public b;
    uint[2] public c;
    uint public hashedInput;

    // variables set by bounty provider at Tx 3
    bool public isComplete;

    // variabels set by bounty hunter at Tx 4
    uint[] public input;

    // ! current design only allows one bounty hunter to submit proof
    // TODO: allow multiple bounty hunters to submit proof

    /*
        Tx 1
        * take owner address from factory
        * set bounty details
        * receive native tokens as bounty reward
    */
    constructor(
        address _owner,
        string memory _name,
        string memory _description,
        bytes memory _dataCID
    ) payable {
        transferOwnership(_owner);
        name = _name;
        description = _description;
        dataCID = _dataCID;
    }

    /*
        Tx 2: submit bounty
        * submit CID of zkey, circom
        * submit verifier address
        * submit proof
    */
    function submitBounty(
        bytes memory _zkeyCID,
        bytes memory _circomCID,
        address _verifier,
        uint[2] memory _a,
        uint[2][2] memory _b,
        uint[2] memory _c,
        uint _hashedInput
    ) public {
        verifier = IVerifier(_verifier);
        uint[] memory _input = new uint[](1);
        _input[0] = _hashedInput;
        require(verifier.verifyProof(_a, _b, _c, _input), "Invalid proof");
        a = _a;
        b = _b;
        c = _c;
        hashedInput = _hashedInput;

        zkeyCID = _zkeyCID;
        circomCID = _circomCID;
    }

    /*
        Tx 3: release bounty
        * only callable by bounty provider
        * only callable if bounty is not complete
        * only callable if bounty hunter has submitted proof
    */
    function releaseBounty() public onlyOwner {
        require(!isComplete, "Bounty is already complete");
        require(hashedInput != 0, "Bounty hunter has not submitted proof");
        isComplete = true;
    }

    /*
        Tx 4: claim bounty
        * function to submit preimage of hashed input
        * only callable if SHA256 of preimage matched hashed input
        * only callable if bounty is complete
    */
    function claimBounty(uint[] memory _input) public {
        require(isComplete, "Bounty is not complete");
        require(sha256(abi.encode(_input)) == bytes32(hashedInput), "Invalid preimage");
        input = _input;
        payable(msg.sender).transfer(address(this).balance);
    }

    
    // function to cancel bounty and withdraw reward

    // TODO: function to edit bounty details
}