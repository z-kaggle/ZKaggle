const axios = require("axios");
const ethers = require("ethers");
const lighthouse = require("..");
const lighthouseConfig = require("../../lighthouse.config");

test("upload Buffer Main Case File", async () => {
  const image = 'iVBORw0KGgoAAAANSUhEUgAAAA8AAAAMCAYAAAC9QufkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADCSURBVChTrZJRCoMwDIaTtM56hsEeRNjDELz/yeas7ZLYMBWEOfZBiH+axKSK7bXNcJKcpSQDpZTgrEmx1NPS6zf+VIwsCAHZ9khczJAcjRUNiAjOu02SQY70zJAc0djdukxYenCdXEaak0rnSoH1s+9SNPb3PnvvYY4zxBiXaKEOtfrxOaqvLhW/lWB6TXrrJOMq7OTZTJKMdXyjh8eQ2em4dvgtvPqn2yEH/yD51S0KMm7TBKjrZV9l1/fCu4cmwBsXPlBp+IIIrQAAAABJRU5ErkJggg==';
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

  const deployResponse = (await lighthouse.uploadBuffer(image, apiKey.data.apiKey)).data;

  expect(deployResponse).toHaveProperty("Name");
  expect(typeof deployResponse["Name"]).toBe("string");

  expect(deployResponse).toHaveProperty("Hash");
  expect(typeof deployResponse["Hash"]).toBe("string");

  expect(deployResponse).toHaveProperty("Size");
  expect(typeof deployResponse["Size"]).toBe("string");
}, 60000);