const axios = require("axios");
const { isCID } = require("../../Utils/util");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (cid) => {
  try {
    // cid check
    if(!isCID(cid)){
      throw new Error("Invalid CID");
    }

    // get file info
    const fileInfo = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/lighthouse/file_info?cid=${cid}`
      )
    ).data;
    /*
      return:
        {
          "fileSizeInBytes":"15256",
          "cid":"QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2LdJffc",
          "encryption":false,
          "fileName":"testImages",
          "mimeType":null,
          "txHash":"0xb373590b34cb767d537ea5da40a71232e1491a6327bc8b428743ea1b5fd4ee5a"
        }
    */
    return {data: fileInfo };
  } catch (error) {
    throw new Error(error.message);
  }
};
