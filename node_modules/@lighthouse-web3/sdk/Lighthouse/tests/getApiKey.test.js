const axios = require("axios");
const ethers = require("ethers");
const lighthouse = require("..");
const lighthouseConfig = require("../../lighthouse.config");

test("getApiKey Main Case", async () => {
  const publicKey = "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1";
  const verificationMessage = (
    await axios.get(
      lighthouseConfig.lighthouseAPI +
        `/api/auth/get_message?publicKey=${publicKey}`
    )
  ).data;
  const provider = new ethers.getDefaultProvider();
  const signer = new ethers.Wallet(
    "0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b",
    provider
  );
  const signedMessage = await signer.signMessage(verificationMessage);

  const response = await lighthouse.getApiKey(publicKey, signedMessage);

  expect(typeof response.data.apiKey).toBe("string");
}, 60000);

test("getApiKey Null Case", async () => {
  try{
    const publicKey = "0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1";
    const apiKey = await lighthouse.getApiKey(publicKey, "signedMessage");
  } catch (error){
    expect(typeof error.message).toBe("string");
  }
}, 60000);
