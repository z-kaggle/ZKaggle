/* istanbul ignore file */
const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (e, accessToken, uploadProgressCallback=()=>{}) => {
  try {
    const endpoint = lighthouseConfig.lighthouseNode + "/api/v0/add";
    e.persist();
    let mimeType = null;
    if (e.target.files.length === 1) {
      mimeType = e.target.files[0].type;
    }

    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("file", e.target.files[i]);
    }

    const token = "Bearer " + accessToken;

    const response = await axios.post(endpoint, formData, {
      maxContentLength: "Infinity",
      maxBodyLength: "Infinity",
      headers: {
        "Content-type": `multipart/form-data; boundary= ${formData._boundary}`,
        Encryption: false,
        "Mime-Type": mimeType,
        Authorization: token,
      },
      onUploadProgress: function (progressEvent) {
        const _progress = Math.round(
           progressEvent.loaded / progressEvent.total
        );
        uploadProgressCallback({
          "progress": _progress,
          "total": progressEvent.total,
          "uploaded": progressEvent.loaded
        })
      },
    });

    if(typeof response.data === "string") {
      const temp = response.data.split("\n");
      response.data = JSON.parse(temp[temp.length - 2]);
    }

    /*
      {
        data: {
          Name: 'flow1.png',
          Hash: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s',
          Size: '31735'
        }
      }
    */
    return {data: response.data};
  } catch(error) {
    throw new Error(error.message);
  }
};
