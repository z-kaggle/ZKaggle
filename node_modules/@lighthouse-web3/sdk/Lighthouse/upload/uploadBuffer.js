const axios = require("axios");
const NodeFormData = eval("require")("form-data");

const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (buffer, apiKey, mimeType="") => {
  try {
    const token = "Bearer " + apiKey;
    const endpoint = lighthouseConfig.lighthouseNode + "/api/v0/add";
    
    // Upload file
    const formDdata = new NodeFormData();
    
    formDdata.append(
      "file",
      buffer
    );

    const response = await axios.post(endpoint, formDdata, {
      withCredentials: true,
      maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large directories
      maxBodyLength: "Infinity",
      headers: {
        "Content-type": `multipart/form-data; boundary= ${formDdata._boundary}`,
        "Encryption": false,
        "Mime-Type": mimeType,
        Authorization: token,
      },
    });

    return {data: response.data};
  } catch (error) {
    throw new Error(error.message);
  }
};
