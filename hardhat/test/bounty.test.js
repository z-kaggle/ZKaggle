const { expect } = require("chai");
const { ethers } = require("hardhat");
const { groth16 } = require("snarkjs");

const fs = require("fs");
const base32 = require("base32.js");

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

// cid of the uploaded file in base32
const ipfs_cid = "bafkreig42jyiawthjkmskza765hn6krgqs7uk7cmtjmggb6mgnjql7dqje";

const json = require("./mnist_latest_input.json");

let INPUT = {};

for (const [key, value] of Object.entries(json)) {
    if (Array.isArray(value)) {
        let tmpArray = [];
        for (let i = 0; i < value.flat().length; i++) {
            tmpArray.push(Fr.e(value.flat()[i]));
        }
        INPUT[key] = tmpArray;
    } else {
        INPUT[key] = Fr.e(value);
    }
}

describe("Bounty contract test", function () {
    let cidraw; // raw CID of the uploaded file

    describe("Tx 1: Creating a bounty", function () {

        before(async function () {
            const decoder = new base32.Decoder();
            cidraw = decoder.write(ipfs_cid.slice(1)).finalize();
            // console.log(cid);
        });

        it("Should reject deploying the contract is msg.value is 0", async function () {
            const owner = await ethers.provider.getSigner(0).getAddress();
            const Bounty = await ethers.getContractFactory("Bounty");
            const bounty = await Bounty.deploy();
            await bounty.deployed();
            
            await expect(bounty.initialize(
                owner,
                "Bounty 1",
                "This is the first bounty",
                cidraw
            )).to.be.revertedWith("Bounty reward must be greater than 0");
        });

        it("Should deploy the contract and set owner to first input", async function () {
            const owner = await ethers.provider.getSigner(0).getAddress();
            const Bounty = await ethers.getContractFactory("Bounty");
            const bounty = await Bounty.deploy();
            await bounty.deployed();

            const tx = await bounty.initialize(
                owner,
                "Bounty 1",
                "This is the first bounty",
                cidraw,
                { value: ethers.utils.parseEther("1")}
            );
            await tx.wait();
            expect(await bounty.name()).to.equal("Bounty 1");
            expect(await bounty.description()).to.equal("This is the first bounty");
            expect(await bounty.dataCID()).to.equal('0x' + cidraw.toString('hex'));
            expect(await bounty.owner()).to.equal(owner);
        });
    });

    let a, b, c, Input;

    describe("Tx 2: Submitting a bounty", function () {
        let bounty, verifier;

        before(async function () {
            // Deploy the contract
            const owner = await ethers.provider.getSigner(0).getAddress();
            const Bounty = await ethers.getContractFactory("Bounty");
            bounty = await Bounty.deploy();
            await bounty.deployed();

            const tx = await bounty.initialize(
                owner,
                "Bounty 1",
                "This is the first bounty",
                cidraw,
                { value: ethers.utils.parseEther("1")}
            );
            await tx.wait();

            // Deploy the verifier
            const Verifier = await ethers.getContractFactory("Verifier");
            verifier = await Verifier.deploy();
            await verifier.deployed();

            // Generate proof

            const bytes = fs.readFileSync("assets/mnist_image.pgm");
            const binary = [...bytes].map((b) => b.toString(2).padStart(8, "0").split("")).flat();

            INPUT["in"] = binary;
            INPUT["salt"] = "123456789";

            const { proof, publicSignals } = await groth16.fullProve(INPUT, "circuits/build/circuit_js/circuit.wasm", "circuits/build/circuit_final.zkey");

            const calldata = await groth16.exportSolidityCallData(proof, publicSignals);

            const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

            a = [argv[0], argv[1]];
            b = [[argv[2], argv[3]], [argv[4], argv[5]]];
            c = [argv[6], argv[7]];
            Input = argv.slice(8);
        });

        it("Should reject a bounty with wrong proof", async function () {
            await expect(bounty.connect(ethers.provider.getSigner(1)).
                submitBounty(
                    0x0,
                    0x0,
                    0x0,
                    verifier.address,
                    [0, 0],
                    [[0, 0], [0, 0]],
                    [0, 0],
                    Input
                )).to.be.revertedWith("Invalid proof");
        });

        it("Should reject a bounty with wrong verifier", async function () {
            await expect(bounty.connect(ethers.provider.getSigner(1)).
                submitBounty(
                    0x0,
                    0x0,
                    0x0,
                    ethers.constants.AddressZero,
                    a,
                    b,
                    c,
                    Input
                )).to.be.revertedWith("Invalid verifier address");
        });

        it("Should reject a bounty with wrong input", async function () {
            await expect(bounty.connect(ethers.provider.getSigner(1)).
                submitBounty(
                    0x0,
                    0x0,
                    0x0,
                    verifier.address,
                    a,
                    b,
                    c,
                    [0, 0, 0, 0]
                )).to.be.revertedWith("Data CID mismatch");
        });

        it("Should submit a bounty", async function () {
            const submitter = await ethers.provider.getSigner(1).getAddress();
            const tx = await bounty.connect(ethers.provider.getSigner(1)).
                submitBounty(
                    0x0,
                    0x0,
                    0x0,
                    verifier.address,
                    a,
                    b,
                    c,
                    Input
                );
            await tx.wait();

            expect(tx).to.emit(bounty, "BountySubmitted");
            expect(await bounty.bountyHunter()).to.equal(submitter);
        });

        it("Should reject submitting a submitted bounty", async function () {
            await expect(bounty.connect(ethers.provider.getSigner(1)).
                submitBounty(
                    0x0,
                    0x0,
                    0x0,
                    verifier.address,
                    a,
                    b,
                    c,
                    Input
                )).to.be.revertedWith("Bounty already submitted");
        });
    });

    describe("Tx 3: Releasing a bounty", function () {
        let bounty, verifier;

        before(async function () {
            // Deploy the contract
            const owner = await ethers.provider.getSigner(0).getAddress();
            const Bounty = await ethers.getContractFactory("Bounty");
            bounty = await Bounty.deploy();
            await bounty.deployed();
            const tx = await bounty.initialize(
                owner,
                "Bounty 1",
                "This is the first bounty",
                cidraw,
                { value: ethers.utils.parseEther("1")}
            );
            await tx.wait();

            // Deploy the verifier
            const Verifier = await ethers.getContractFactory("Verifier");
            verifier = await Verifier.deploy();
            await verifier.deployed();
        });

        it("Should reject releasing an unsubmitted bounty", async function () {
            await expect(bounty.releaseBounty()).to.be.revertedWith("Bounty hunter has not submitted proof");
        });

        it("Should reject releasing a bounty by non-owner", async function () {

            const tx = await bounty.connect(ethers.provider.getSigner(1)).
                submitBounty(
                    0x0,
                    0x0,
                    0x0,
                    verifier.address,
                    a,
                    b,
                    c,
                    Input
                );
            await tx.wait();
            await expect(bounty.connect(ethers.provider.getSigner(1)).releaseBounty()).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should release a bounty", async function () {
            const tx = await bounty.releaseBounty();
            await tx.wait();

            expect(tx).to.emit(bounty, "BountyReleased");
            expect(await bounty.isComplete()).to.equal(true);
        });

        it("Should reject releasing a bounty twice", async function () {
            await expect(bounty.releaseBounty()).to.be.revertedWith("Bounty is already complete");
        });
    });

    describe("Tx 4: Claiming a bounty", function () {
        let bounty, verifier;

        before(async function () {
            // Deploy the contract
            const owner = await ethers.provider.getSigner(0).getAddress();
            const Bounty = await ethers.getContractFactory("Bounty");
            bounty = await Bounty.deploy();
            await bounty.deployed();

            let tx = await bounty.initialize(
                owner,
                "Bounty 1",
                "This is the first bounty",
                cidraw,
                { value: ethers.utils.parseEther("1")}
            );
            await tx.wait();

            // Deploy the verifier
            const Verifier = await ethers.getContractFactory("Verifier");
            verifier = await Verifier.deploy();
            await verifier.deployed();

            tx = await bounty.connect(ethers.provider.getSigner(1)).
                submitBounty(
                    0x0,
                    0x0,
                    0x0,
                    verifier.address,
                    a,
                    b,
                    c,
                    Input
                );
            await tx.wait();
        });

        it("Should reject claiming a bounty by non bounty hunter", async function () {
            await expect(bounty.connect(ethers.provider.getSigner(2))
                .claimBounty([0, 0])).to.be.revertedWith("Only bounty hunter can claim bounty");
        });

        it("Should reject claiming an uncompleted bounty", async function () {
            await expect(bounty.connect(ethers.provider.getSigner(1))
                .claimBounty([0, 0]))
                .to.be.revertedWith("Bounty is not complete");
        });

        it("Should claim a bounty", async function () {
            const bountyHunter = await ethers.provider.getSigner(1).getAddress();
            const balance = await ethers.provider.getBalance(bountyHunter);
            let tx = await bounty.releaseBounty();
            await tx.wait();
            tx = await bounty.connect(ethers.provider.getSigner(1))
                .claimBounty([5, 123456789]);
            await tx.wait();

            expect(tx).to.emit(bounty, "BountyClaimed");
            // Check that the bounty hunter has been paid
            expect(await ethers.provider.getBalance(bountyHunter)).to.greaterThan(balance);
            // Check that the input has been updated
            expect(await bounty.input(0)).to.equal(5);
            expect(await bounty.input(1)).to.equal(123456789);
        });

        it("Should reject claiming a claimed bounty", async function () {
            await expect(bounty.connect(ethers.provider.getSigner(1))
                .claimBounty([0, 0]))
                .to.be.revertedWith("Bounty already claimed");
        });
    });
});
