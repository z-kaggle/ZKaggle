// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./IVerifier.sol";

contract Bounty is Initializable, OwnableUpgradeable {
    // variables set by bounty provier at Tx 1 (constructor)
    string public name;
    string public description;
    bytes public dataCID;
    // reward amount is not stored, use contract balance instead

    // variables set by bounty hunter at Tx 2
    address public bountyHunter;
    bytes public zkeyCID;
    bytes public circomCID;
    bytes public verifierCID;
    IVerifier public verifier;
    uint[2] public a;
    uint[2][2] public b;
    uint[2] public c;
    uint[] public hashedInput;

    // variables set by bounty provider at Tx 3
    bool public isComplete;

    // variabels set by bounty hunter at Tx 4
    uint[] public input;

    uint8 public constant CID_VERSION = 1;
    uint8 public constant CID_CODEC = 0x55; // for raw buffer
    uint8 public constant CID_HASH = 0x12; // for sha256
    uint8 public constant CID_LENGTH = 32; // for sha256

    // ! current design only allows one bounty hunter to submit proof
    // TODO: allow multiple bounty hunters to submit proof

    event BountySubmitted();
    event BountyReleased();
    event BountyClaimed();

    /*
        Tx 1
        * take owner address from factory
        * set bounty details
        * receive native tokens as bounty reward
    */
    function initialize (
        address _owner,
        string memory _name,
        string memory _description,
        bytes memory _dataCID
    ) public payable initializer {
        require(msg.value > 0, "Bounty reward must be greater than 0");
        __Ownable_init();
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
        bytes memory _verifierCID,
        address _verifier,
        uint[2] memory _a,
        uint[2][2] memory _b,
        uint[2] memory _c,
        uint[] memory _hashedInput
        /*
         * should be length 4, will extend to support arbitrary length
         * first two elements are hash of computed results
         * last two elements are the dataCID
         */
    ) public {
        require(_hashedInput.length == 4, "Invalid hashed input length"); // TODO: support arbitrary length
        require(bountyHunter == address(0), "Bounty already submitted");
        // verifier address should not be 0x0
        require(_verifier != address(0), "Invalid verifier address");
        // * can save gas by pre-hashing dataCID
        require(
            keccak256(dataCID) ==
                keccak256(
                    abi.encodePacked(
                        CID_VERSION,
                        CID_CODEC,
                        CID_HASH,
                        CID_LENGTH,
                        concatDigest(_hashedInput[2], _hashedInput[3])
                    )
                ),
            "Data CID mismatch"
        );

        verifier = IVerifier(_verifier);
        require(verifier.verifyProof(_a, _b, _c, _hashedInput), "Invalid proof");
        a = _a;
        b = _b;
        c = _c;
        hashedInput = _hashedInput;

        zkeyCID = _zkeyCID;
        circomCID = _circomCID;
        verifierCID = _verifierCID;

        bountyHunter = msg.sender;

        emit BountySubmitted();
    }

    /*
        Tx 3: release bounty
        * only callable by bounty provider
        * only callable if bounty is not complete
        * only callable if bounty hunter has submitted proof
    */
    function releaseBounty() public onlyOwner {
        require(!isComplete, "Bounty is already complete");
        require(a[0] != 0, "Bounty hunter has not submitted proof");
        isComplete = true;

        emit BountyReleased();
    }

    /*
        Tx 4: claim bounty
        * function to submit preimage of hashed input
        * only callable if SHA256 of preimage matched hashed input
        * only callable if bounty is complete
    */
    function claimBounty(uint[] memory _input) public {
        require(_input.length == 2, "Invalid input length"); // TODO: support arbitrary length
        require(msg.sender == bountyHunter, "Only bounty hunter can claim bounty");
        require(isComplete, "Bounty is not complete");
        require(address(this).balance > 0, "Bounty already claimed");

        // check if preimage matches hashed input
        require(
            sha256(abi.encode(_input[0], _input[1])) == concatDigest(hashedInput[0], hashedInput[1]),
            "Invalid preimage"
        );
        input = _input;
        payable(msg.sender).transfer(address(this).balance);

        emit BountyClaimed();
    }

    // function to concat input into digest
    function concatDigest(uint input1, uint input2) public pure returns (bytes32) {
        return bytes32((input1 << 128) + input2);
    }

    // view function to verify proof
    function verifyProof(
        uint[2] memory _a,
        uint[2][2] memory _b,
        uint[2] memory _c,
        uint[] memory _hashedInput
    ) public view returns (bool) {
        require(verifier != IVerifier(address(0)), "Verifier not set");
        return verifier.verifyProof(_a, _b, _c, _hashedInput);
    }

    // function to cancel bounty and withdraw reward

    // TODO: function to edit bounty details
}
