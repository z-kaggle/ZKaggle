const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { groth16 } = require("snarkjs");
const wasm_tester = require("circom_tester").wasm;

const fs = require("fs");
const crypto = require("crypto");
const base32 = require("base32.js");

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

    let digest;
    let a, b, c, Input;

    let digest2;

    before(async function () {
        Verifier = await ethers.getContractFactory("Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();

        const bytes = fs.readFileSync("assets/mnist_image.pgm");

        const hash = crypto.createHash('sha256');
        hash.update(bytes);

        digest = hash.digest('hex');

        const binary = [...bytes].map((b) => b.toString(2).padStart(8, "0").split("")).flat();
        // console.log(binary);

        INPUT["in"] = binary;

        // compute hash from salt and expected output
        INPUT["salt"] = "123456789";

        const hash2 = crypto.createHash('sha256');
        hash2.update((123456789).toString(16).padStart(32, "0") + (5).toString(16).padStart(32, "0"));
        digest2 = hash2.digest('hex');
        
        const { proof, publicSignals } = await groth16.fullProve(INPUT, "circuits/build/circuit_js/circuit.wasm","circuits/build/circuit_final.zkey");

        const calldata = await groth16.exportSolidityCallData(proof, publicSignals);
        
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        
        a = [argv[0], argv[1]];
        b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        c = [argv[6], argv[7]];
        Input = argv.slice(8);
    });

    it("Check circuit output", async () => {
        const circuit = await wasm_tester("circuits/circuit.circom");
        // split digest into two slices and convert to BigNumber
        const digest11 = Fr.e(digest.slice(0, 32), 16);
        const digest12 = Fr.e(digest.slice(32, 64), 16);

        const digest21 = Fr.e(digest2.slice(0, 32), 16);
        const digest22 = Fr.e(digest2.slice(32, 64), 16);

        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1], digest21)));
        assert(Fr.eq(Fr.e(witness[2], digest22)));
        assert(Fr.eq(Fr.e(witness[3], digest11)));
        assert(Fr.eq(Fr.e(witness[4], digest12)));
        
    });

    it("Verifier should return true for correct proofs", async function () {
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });

    it("Verifier should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0, 0, 0, 0];
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });

    let cidraw;

    it("CIDv1 should match that from IPFS", async function () {
        const cid_version = 1;
        const cid_codec = 85; // raw 0x55
        const hash_function_code = 18; // SHA-256 0x12
        const length = 32;
        
        cidraw = cid_version.toString(16).padStart(2, "0") + cid_codec.toString(16).padStart(2, "0") + hash_function_code.toString(16).padStart(2, "0") + length.toString(16).padStart(2, "0") + digest;
        const buf = Buffer.from(cidraw, 'hex');
        
        const encoder = new base32.Encoder();
        const cid = encoder.write(buf).finalize().toLowerCase();

        expect("b"+cid).equal("bafkreig42jyiawthjkmskza765hn6krgqs7uk7cmtjmggb6mgnjql7dqje");
    });

    it("Payload CID should match that from Lotus", async function () {
        const buf = Buffer.from(cidraw, 'hex');
        const cid = buf.toString('base64');
        
        expect("m"+cid).equal("mAVUSINzScIBaZ0qZJWQf907fKiaEv0V8TJpYYwfMM1MF/HBJ");
    });

    it("CID contract should compute correct CID", async function () {
        const Cid = await ethers.getContractFactory("CID");
        const cid = await Cid.deploy(verifier.address);

        expect(await cid.computeCID(a, b, c, Input)).equal("0x"+cidraw);
    });

});
