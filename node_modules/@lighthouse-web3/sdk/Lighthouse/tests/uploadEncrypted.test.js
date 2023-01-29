const axios = require("axios");
const { resolve } = require("path");
const ethers = require("ethers");
const lighthouse = require("..");
const lighthouseConfig = require("../../lighthouse.config");

const signAuthMessage = async (publicKey, privateKey) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
    .message;
  const signedMessage = await signer.signMessage(messageRequested);
  return signedMessage;
};

describe("UploadEncrypted", () => {
  test("deploy Encrypted Main Case File", async () => {
    const path = resolve(process.cwd(), "Utils/testImages/testImage1.svg");

    const publicKey = "0x4f544A7a285E8B9cc948884acB9Cac4b267bBfc7";

    const verificationMessage = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/auth/get_message?publicKey=${publicKey}`
      )
    ).data;
    const provider = new ethers.getDefaultProvider();
    const signer = new ethers.Wallet(
      "0x8488d2c632da07a93647d7cf701ab6728a884467b1595f3c94007977a20b3539",
      provider
    );
    const signedMessage = await signer.signMessage(verificationMessage);
    const apiKey = await lighthouse.getApiKey(publicKey, signedMessage);

    const signedMessageEncryption = await signAuthMessage(
      publicKey,
      "0x8488d2c632da07a93647d7cf701ab6728a884467b1595f3c94007977a20b3539"
    );
    const deployResponse = (
      await lighthouse.uploadEncrypted(
        path,
        apiKey.data.apiKey,
        publicKey,
        signedMessageEncryption
      )
    ).data;

    expect(deployResponse).toHaveProperty("Name");
    expect(typeof deployResponse["Name"]).toBe("string");

    expect(deployResponse).toHaveProperty("Hash");
    expect(typeof deployResponse["Hash"]).toBe("string");

    expect(deployResponse).toHaveProperty("Size");
    expect(typeof deployResponse["Size"]).toBe("string");
  }, 60000);
});
