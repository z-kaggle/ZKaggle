/* istanbul ignore file */
const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (text, apiKey) => {
  try {
    const token = "Bearer " + apiKey;
    const endpoint = lighthouseConfig.lighthouseNode + "/api/v0/add";
    
    // Upload file
    const formData = new FormData();
    const blob = new Blob([text], {type: "text/plain"});
    
    formData.append(
      "file",
      blob
    );

    const response = await axios.post(endpoint, formData, {
      withCredentials: false,
      maxContentLength: "Infinity",
      maxBodyLength: "Infinity",
      headers: {
        "Content-type": `multipart/form-data; boundary= ${formData._boundary}`,
        "Encryption": false,
        "Mime-Type": "text/plain",
        Authorization: token
      },
    });

    return {data: response.data};
  } catch (error) {
    throw new Error(error.message);
  }
};
