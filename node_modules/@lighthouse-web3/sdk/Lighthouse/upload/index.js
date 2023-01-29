const uploadFile = require("./uploadFile");

module.exports = async (path, apiKey) => {
  // Upload File to IPFS
  return await uploadFile(path, apiKey);
};
