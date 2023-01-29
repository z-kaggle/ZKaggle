/* istanbul ignore file */
const axios = require("axios");
const NodeFormData = eval("require")("form-data");
const { encryptFile } = eval("require")("./encryptionNode");
const { generate, saveShards } = eval("require")("@lighthouse-web3/kavach");

const lighthouseConfig = require("../../../lighthouse.config");

module.exports = async (text, apiKey, publicKey, signed_message) => {
  try {
    const token = "Bearer " + apiKey;
    const endpoint = lighthouseConfig.lighthouseNode + "/api/v0/add";

    // Upload file
    const formDdata = new NodeFormData();

    const { masterKey: fileEncryptionKey, keyShards } = await generate();

    const encryptedData = await encryptFile(
      Buffer.from(text),
      fileEncryptionKey
    );

    formDdata.append("file", Buffer.from(encryptedData));

    const response = await axios.post(endpoint, formDdata, {
      withCredentials: true,
      maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large directories
      maxBodyLength: "Infinity",
      headers: {
        "Content-type": `multipart/form-data; boundary= ${formDdata._boundary}`,
        Encryption: true,
        "Mime-Type": "text/plain",
        Authorization: token,
      },
    });

    const { isSuccess, error } = await saveShards(
      publicKey,
      response.data.Hash,
      signed_message,
      keyShards
    );
    
    if(error){
      throw new Error("Error encrypting file");
    }
    return { data: response.data };
  } catch (error) {
    throw new Error(error.message);
  }
};
