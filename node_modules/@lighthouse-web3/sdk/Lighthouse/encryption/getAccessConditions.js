const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (
  cid
) => {
  try {
    const conditions = await axios.get(
      lighthouseConfig.lighthouseBLSNode + `/api/fileAccessConditions/get/${cid}`
    );

    return { data: conditions.data };
  } catch (error) {
    throw new Error(error.message);
  }
};
