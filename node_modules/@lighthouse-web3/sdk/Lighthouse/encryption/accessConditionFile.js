const { accessControl } = require("@lighthouse-web3/kavach");

module.exports = async (
  publicKey,
  cid,
  signedMessage,
  conditions,
  aggregator = null,
  chainType = "evm"
) => {
  // send encryption key
  const { isSuccess, error } = await accessControl(
    publicKey,
    cid,
    signedMessage,
    conditions,
    aggregator,
    chainType
  );

  if (error) {
    throw error;
  }
  return { data: { cid: cid, status: "Success" } };
};
