const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (cid) => {
  try {
    const dealStatus = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/lighthouse/deal_status/?cid=${cid}`
      )
    ).data;
    return {data: { dealStatus }};
  } catch (error) {
    throw new Error(error.message);
  }
};
