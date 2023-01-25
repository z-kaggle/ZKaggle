const { expect } = require("chai");
const { ethers } = require("hardhat");

require("dotenv").config();
const lighthouse = require('@lighthouse-web3/sdk');
const { recoverShards } = require("@lighthouse-web3/kavach");
const fs = require("fs");

const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;
const privateKeyBob = process.env.PRIVATE_KEY_BOB;
const publicKeyBob = process.env.PUBLIC_KEY_BOB;

const apiKey = process.env.API_KEY;
const path = "assets/mnist_image.pgm"; //Give path to the file

const sign_auth_message = async (publicKey, privateKey) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = new ethers.Wallet(privateKey, provider);
    const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data.message;
    const signedMessage = await signer.signMessage(messageRequested);
    return (signedMessage)
}

describe("Lighthouse SDK test", function () {

    it("Should upload file to lighthouse", async function () {
        const response = await lighthouse.upload(path, apiKey);
        expect(response.data.Name).equal("mnist_image.pgm");
        expect(response.data.Hash).equal("QmevD3vQfg6Nf9RYWGCrNdfmT49BhLS714sxGkVifqmYg9");
        expect(response.data.Size).equal("808")
    });

    let cid;

    it("Should upload encrypted file to lighthouse", async function () {
        const signed_message = await sign_auth_message(publicKey, privateKey);

        const response = await lighthouse.uploadEncrypted(
            path,
            apiKey,
            publicKey,
            signed_message,
        );

        expect(response.data.Name).equal("mnist_image.pgm");
        // expect(response.data.Hash).equal("QmeakAMwVmYerw8DgZ5jyNHMV8G1fe6cNMvViezzM6bRqt");
        expect(response.data.Size).equal("852");

        cid = response.data.Hash;
    });

    it("Should download decrypted file from lighthouse", async function () {
        const signed_message = await sign_auth_message(publicKey, privateKey);
        const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
            cid,
            publicKey,
            signed_message
        );
        const decrypted = await lighthouse.decryptFile(
            cid,
            fileEncryptionKey.data.key
        );
        expect(decrypted.byteLength).equal(797);
    });

    it("Should share private file with another user", async function () {
        const signed_message = await sign_auth_message(publicKey, privateKey);

        const response = await lighthouse.shareFile(
            publicKey,
            [publicKeyBob],
            cid,
            signed_message,
        );

        expect(response.data.cid).equal(cid);
        expect(response.data.status).equal("Success");
        expect(response.data.shareTo[0]).equal(publicKeyBob);
    });

    it("Should download decrypted file from lighthouse shared with another user", async function () {
        const signed_message = await sign_auth_message(publicKeyBob, privateKeyBob);
        const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
            cid,
            publicKeyBob,
            signed_message
        );
        const decrypted = await lighthouse.decryptFile(
            cid,
            fileEncryptionKey.data.key
        );
        expect(decrypted.byteLength).equal(797);
    });

    it("Should revoke access to private file from another user", async function () {
        const signed_message = await sign_auth_message(publicKey, privateKey);

        const response = await lighthouse.revokeFileAccess(
            publicKey,
            [publicKeyBob],
            cid,
            signed_message,
        );

        expect(response.data.cid).equal(cid);
        expect(response.data.status).equal("Success");
        expect(response.data.revokeTo[0]).equal(publicKeyBob);

    });

    it("Should not be able to download decrypted file from lighthouse shared with another user", async function () {
        const signed_message = await sign_auth_message(publicKeyBob, privateKeyBob);

        const { error, shards } = await recoverShards(
            publicKeyBob,
            cid,
            signed_message,
            5
        );

        expect(shards.length).equal(0);
        expect(error?.message).equal("you don't have access");
    });
});