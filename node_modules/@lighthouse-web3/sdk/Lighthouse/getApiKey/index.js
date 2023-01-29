const axios = require("axios");

const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (publicKey, signedMessage) => {
  try {
    const apiKey = (
      await axios.post(
        lighthouseConfig.lighthouseAPI + `/api/auth/get_api_key`,
        {
          publicKey: publicKey,
          signedMessage: signedMessage,
        }
      )
    ).data;
    /*
      return:
        { data: { apiKey: '489a497e-4e0c-4cb5-9522-ca07740f6dfb' } }
    */
    return {data: { apiKey } };
  } catch (error) {
    throw new Error(error.response.data);
  }
};
