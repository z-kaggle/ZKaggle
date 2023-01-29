const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (publicKey) => {
  try {
    // Get users data usage
    const userDataUsage = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/user/user_data_usage?publicKey=${publicKey}`
      )
    ).data;
    /*
      return:
        { data: { dataLimit: 1073741824, dataUsed: 1062512300 } }
    */
    return {data: userDataUsage };
  } catch (error) {
    throw new Error(error.message);
  }
};
