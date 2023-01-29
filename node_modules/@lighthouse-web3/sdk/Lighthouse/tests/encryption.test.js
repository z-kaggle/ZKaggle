const ethers = require("ethers");
const { addressValidator } = require("../../Utils/util");
const lighthouse = require("..");

const signAuthMessage = async (publicKey, privateKey) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  const address = addressValidator(publicKey);
  const messageRequested = (await lighthouse.getAuthMessage(address)).data
    .message;
  const signedMessage = await signer.signMessage(messageRequested);
  return signedMessage;
};

describe("EncryptionTest", () => {
  test("fetchEncryptionKey Main Case File", async () => {
    const publicKey = "0xa3c960b3ba29367ecbcaf1430452c6cd7516f588";
    const cid = "QmVkHgHnYVUfvTXsaJisHRgc89zsrgVL6ATh9mSiegRYrX";

    const signed_message = await signAuthMessage(
      publicKey,
      "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a"
    );

    const response = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signed_message
    );

    expect(typeof response.data.key).toBe("string");
  }, 60000);

  test("fetchEncryptionKey Not Authorized", async () => {
    try {
      const publicKey = "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26";
      const cid = "QmQA5LfUpoyBGcc6E4doYDU7YeWEar4bppfjZ6mB2by7mK";

      const signed_message =
        "0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895";

      const key = await lighthouse.fetchEncryptionKey(
        cid,
        publicKey,
        signed_message
      );
    } catch (error) {
      expect(typeof error.message).toBe("string");
    }
  }, 60000);

  test("getEncryptionKeyPair Invalid Auth", async () => {
    try {
      const publicKey = "0xA3C960B3BA29367ecBCAf1430452C6cd7516F588";
      const keyPair = await lighthouse.getEncryptionKeyPair(
        publicKey,
        "apiKey"
      );
    } catch (error) {
      expect(typeof error.message).toBe("string");
    }
  }, 20000);

  test("getAuthMessage main", async () => {
    const response = await lighthouse.getAuthMessage(
      "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26"
    );

    expect(typeof response.data.message).toBe("string");
  }, 20000);

  test("Share main", async () => {
    const publicKey = "0x969e19A952A9aeF004e4F711eE481D72A59470B1";
    const cid = "QmeYAMQLG7n4y2XNVwTexkzxNSzP4FQZyXdYM2U6cJhx8S";

    const signed_message = await signAuthMessage(
      publicKey,
      "0xa74ba0e4cc2e9f0be6776509cdb1495d76ac8fdc727a8b93f60772d73893fe2e"
    );

    const response = await lighthouse.shareFile(
      publicKey,
      ["0x201Bcc3217E5AA8e803B41d1F5B6695fFEbD5CeD"],
      cid,
      signed_message
    );

    expect(typeof response.data).toBe("object");
    expect(typeof response.data.cid).toBe("string");
  }, 60000);

  test("Access Control", async () => {
    const publicKey = "0x969e19A952A9aeF004e4F711eE481D72A59470B1";
    const cid = "QmeYAMQLG7n4y2XNVwTexkzxNSzP4FQZyXdYM2U6cJhx8S";

    // Conditions to add
    const conditions = [
      {
        id: 1,
        chain: "FantomTest",
        method: "balanceOf",
        standardContractType: "ERC20",
        contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
        returnValueTest: { comparator: ">=", value: "0" },
        parameters: [":userAddress"],
      },
      {
        id: 2,
        chain: "FantomTest",
        method: "balanceOf",
        standardContractType: "ERC20",
        contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
        returnValueTest: { comparator: ">=", value: "0" },
        parameters: [":userAddress"],
      },
    ];

    const aggregator = "([1] and [2])";

    const signedMessage = await signAuthMessage(
      publicKey,
      "0xa74ba0e4cc2e9f0be6776509cdb1495d76ac8fdc727a8b93f60772d73893fe2e"
    );
    const response = await lighthouse.accessCondition(
      publicKey,
      cid,
      signedMessage,
      conditions,
      aggregator
    );

    expect(typeof response.data).toBe("object");
    expect(typeof response.data.cid).toBe("string");
  }, 60000);

  test("Revoke Access", async () => {
    const publicKey = "0xa3c960b3ba29367ecbcaf1430452c6cd7516f588";
    const cid = "QmVkHgHnYVUfvTXsaJisHRgc89zsrgVL6ATh9mSiegRYrX";
    const revokeTo = "0x969e19A952A9aeF004e4F711eE481D72A59470B1";
    const signedMessage = await signAuthMessage(
      publicKey,
      "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a"
    );

    // Get File Encryption Key
    const response = await lighthouse.revokeFileAccess(
      publicKey,
      revokeTo,
      cid,
      signedMessage
    );

    expect(typeof response.data).toBe("object");
    expect(typeof response.data.cid).toBe("string");
  }, 20000);

  test("Get Access Conditions", async () => {
    const cid = "QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s";

    // Get File Encryption Key
    const response = await lighthouse.getAccessConditions(cid);

    expect(typeof response.data).toBe("object");
    expect(typeof response.data.cid).toBe("string");
  }, 20000);
});
