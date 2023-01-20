const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { groth16 } = require("snarkjs");
const wasm_tester = require("circom_tester").wasm;

const fs = require("fs");
const crypto = require("crypto");

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const json = require("./mnist_latest_input.json");

describe("SHA256 MNIST test", function () {
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

    let Verifier;
    let verifier;

    let bytes;

    before(async function () {
        Verifier = await ethers.getContractFactory("Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();

        bytes = fs.readFileSync("assets/mnist_image.pgm");

        const binary = [...bytes].map((b) => b.toString(2).padStart(8, "0").split("")).flat();
        // console.log(binary);

        INPUT["in"] = binary;
    });
    

    it("Circuit test", async () => {
        const circuit = await wasm_tester("circuits/circuit.circom");

        const hash = crypto.createHash('sha256');
        hash.update(bytes);

        const digest = hash.digest('hex');
        // split digest into two slices and convert to BigNumber
        const digest1 = Fr.e(digest.slice(0, 32), 16);
        const digest2 = Fr.e(digest.slice(32, 64), 16);

        // console.log(digest, digest1, digest2);
        
        // const digest = [...hash.digest()].map((b) => b.toString(2).padStart(8, "0").split("")).flat();
        // console.log(digest);

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(5)));

        // console.log(witness[2]);
        // console.log(witness[3], witness[4]);
        assert(Fr.eq(Fr.e(witness[3], digest1)));
        assert(Fr.eq(Fr.e(witness[4], digest2)));
        
        // for (let i = 0; i < digest.length; i++) {
        //     assert(Fr.eq(Fr.e(witness[i+3]),Fr.e(digest[i])));
        // }
    });

    it("Verifier should return true for correct proofs", async function () {

        const { proof, publicSignals } = await groth16.fullProve(INPUT, "circuits/build/circuit_js/circuit.wasm","circuits/build/circuit_final.zkey");

        const calldata = await groth16.exportSolidityCallData(proof, publicSignals);
    
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });

    it("Verifier should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0, 0, 0, 0];
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });

});
