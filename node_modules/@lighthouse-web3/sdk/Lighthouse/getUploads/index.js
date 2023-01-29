const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (publicKey, pageNo=1) => {
  try {
    const uploads = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/user/get_uploads?publicKey=${publicKey}&pageNo=${pageNo}`
      )
    ).data;

    /*
      {
        data: {
          uploads: [
            {
              publicKey: '0xa3c960b3ba29367ecbcaf1430452c6cd7516f588',
              fileName: 'flow1.png',
              mimeType: 'image/png',
              txHash: '0x7c9ee1585be6b85bef471a27535fb4b8d7551340152c36c025743c36fd0d1acc',
              status: 'testnet',
              createdAt: 1662880331683,
              fileSizeInBytes: '31735',
              cid: 'QmZvWp5Xdyi7z5QqGdXZP63QCBNoNvjupF1BohDULQcicA',
              id: 'aaab8053-0f1e-4482-9f84-d413fad14266',
              lastUpdate: 1662883207149,
              encryption: true
            },  
          ]
        }
      }
    */
    return {data: { uploads }};
  } catch (error) {
    throw new Error(error.message);
  }
};
