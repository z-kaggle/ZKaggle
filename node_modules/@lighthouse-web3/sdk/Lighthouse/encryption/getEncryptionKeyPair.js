/* istanbul ignore file */
/* Not in use currently, kept for future use */

const axios = require("axios");
const nacl = require("tweetnacl");
const util = require("tweetnacl-util");

const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (publicKey, accessToken) => {
  try {
    const keyPair = nacl.box.keyPair();

    const response = await axios.post(
      lighthouseConfig.lighthouseAPI + `/api/auth/save_encryption_publicKey`,
      {
        publicKey: publicKey,
        encryptionPublicKey: util.encodeBase64(keyPair.publicKey),
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.status !== 200) {
      throw new Error("Internal Server Error!!!");
    }

    return {
      publicKey: util.encodeBase64(keyPair.publicKey),
      secretKey: util.encodeBase64(keyPair.secretKey),
    };
  } catch {
    return null;
  }
};
