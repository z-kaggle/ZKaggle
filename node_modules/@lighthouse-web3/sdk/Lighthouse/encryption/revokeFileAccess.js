const lighthouseConfig = require("../../lighthouse.config");
const { revokeAccess } = require("@lighthouse-web3/kavach");

module.exports = async (publicKey, revokeTo, cid, signedMessage) => {
  const _revokeTo = Array.isArray(revokeTo) ? revokeTo : [revokeTo];

  // send encryption key
  const { error, revoked } = await revokeAccess(
    publicKey,
    cid,
    signedMessage,
    _revokeTo
  );

  if (error) {
    throw error;
  }
  /*
    {
      data: {
        cid: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s',
        revokeTo: '0x487fc2fE07c593EAb555729c3DD6dF85020B5160',
        status: "Success"
      }
    }
  */
  return { data: { cid, revokeTo, status: "Success" } };
};
