/* istanbul ignore file */
/* Not in use currently, kept for future use */

const nacl = require("tweetnacl");
const util = require("tweetnacl-util");

module.exports = (fileEncryptionKey, encryptionPublicKey, secretKey) => {
  const nonce = nacl.randomBytes(24);
  return {
    encryptedFileEncryptionKey: util.encodeBase64(
      nacl.box(
        util.decodeUTF8(fileEncryptionKey),
        nonce,
        util.decodeBase64(encryptionPublicKey),
        util.decodeBase64(secretKey)
      )
    ),
    nonce: util.encodeBase64(nonce),
  };
};
