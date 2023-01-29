const axios = require("axios");
const { resolve } = require("path");
const ethers = require("ethers");
const lighthouse = require("..");
const lighthouseConfig = require("../../lighthouse.config");

test("upload Main Case File", async () => {
  const path = resolve(process.cwd(), "Utils/testImages/testImage1.svg");
  const publicKey = "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26";
  const verificationMessage = (
    await axios.get(
      lighthouseConfig.lighthouseAPI +
        `/api/auth/get_message?publicKey=${publicKey}`
    )
  ).data;
  const provider = new ethers.getDefaultProvider();
  const signer = new ethers.Wallet(
    "0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895",
    provider
  );
  const signedMessage = await signer.signMessage(verificationMessage);
  const apiKey = await lighthouse.getApiKey(publicKey, signedMessage);

  const deployResponse = (await lighthouse.upload(path, apiKey.data.apiKey)).data;

  expect(deployResponse).toHaveProperty("Name");
  expect(typeof deployResponse["Name"]).toBe("string");

  expect(deployResponse).toHaveProperty("Hash");
  expect(typeof deployResponse["Hash"]).toBe("string");

  expect(deployResponse).toHaveProperty("Size");
  expect(typeof deployResponse["Size"]).toBe("string");
}, 60000);

test("upload Main Case Folder", async () => {
  const path = resolve(process.cwd(), "Utils/testImages");

  const publicKey = "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26";
  const verificationMessage = (
    await axios.get(
      lighthouseConfig.lighthouseAPI +
        `/api/auth/get_message?publicKey=${publicKey}`
    )
  ).data;
  const provider = new ethers.getDefaultProvider();
  const signer = new ethers.Wallet(
    "0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895",
    provider
  );
  const signedMessage = await signer.signMessage(verificationMessage);
  const apiKey = await lighthouse.getApiKey(publicKey, signedMessage);

  const deployResponse = (await lighthouse.upload(path, apiKey.data.apiKey)).data;

  expect(deployResponse).toHaveProperty("Name");
  expect(typeof deployResponse["Name"]).toBe("string");

  expect(deployResponse).toHaveProperty("Hash");
  expect(typeof deployResponse["Hash"]).toBe("string");

  expect(deployResponse).toHaveProperty("Size");
  expect(typeof deployResponse["Size"]).toBe("string");
}, 60000);

test("upload Error Case Wrong Path", async () => {
  try{
    const path = resolve(process.cwd(), "Utils/testImages/testImage2.svg");
    const deployResponse = await lighthouse.upload(path, "apiKey");
  } catch(error) {
    expect(typeof error.message).toBe("string");
  }
}, 60000);

test("upload Error Case Wrong Api Key File", async () => {
  try{
    const path = resolve(process.cwd(), "Utils/testImages/testImage1.svg");
    const deployResponse = await lighthouse.upload(path, "apiKey");
  } catch(error) {
    expect(typeof error.message).toBe("string");
  }
}, 60000);

test("upload Error Case Wrong Api Key Folder", async () => {
  try{
    const path = resolve(process.cwd(), "Utils/testImages");
    const deployResponse = await lighthouse.upload(path, "apiKey");
  } catch(error) {
    expect(typeof error.message).toBe("string");
  }
}, 60000);
