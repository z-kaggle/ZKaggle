/* istanbul ignore file */
const axios = require("axios");
const { decryptFile } = require("./encryptionBrowser");
const lighthouseConfig = require("../../../lighthouse.config");

module.exports = async (cid, fileEncryptionKey, mimeType=null) => {
  const result = await axios.post(
    lighthouseConfig.lighthouseGateway + "/api/v0/cat/" + cid,
    null,
    {
      "Content-Type": "application/json",
      Accept: "application/octet-stream",
      responseType: "blob",
    }
  );

  const decrypted = await decryptFile(
    await result.data.arrayBuffer(),
    fileEncryptionKey
  );

  if (decrypted) {
    if(mimeType){
      return new Blob([decrypted], { type: mimeType });
    } else{
      return new Blob([decrypted]);
    }
  } else {
    return null;
  }
};
