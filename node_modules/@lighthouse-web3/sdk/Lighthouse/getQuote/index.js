const getBalance = require("../getBalance");

// Function return cost and file metadata
const getCosting = async (path, publicKey) => {
  const fs = eval("require")("fs");
  const mime = eval("require")("mime-types");
  const recursive = eval("require")("recursive-fs");
  // Get users data usage
  const user_data_usage = (await getBalance(publicKey)).data;
  if (fs.lstatSync(path).isDirectory()) {
    // Get metadata and cid for all files
    const sources = (await recursive.readdirr(path)).files;
    const metaData = [];
    let totalSize = 0;

    for (let i = 0; i < sources.length; i++) {
      const stats = fs.statSync(sources[i]);
      const mimeType = mime.lookup(sources[i]);
      const fileSizeInBytes = stats.size;
      const fileName = sources[i].split("/").pop();

      totalSize += fileSizeInBytes;

      metaData.push({
        fileSize: fileSizeInBytes,
        mimeType: mimeType,
        fileName: fileName,
      });
    }

    // Return data
    return {
      data: {
        metaData: metaData,
        dataLimit: user_data_usage.dataLimit,
        dataUsed: user_data_usage.dataUsed,
        totalSize: totalSize,
      }
    };
  } else {
    const stats = fs.statSync(path);
    const mimeType = mime.lookup(path);
    const fileSizeInBytes = stats.size;
    const fileName = path.split("/").pop();

    // return response data
    const metaData = [
      {
        fileSize: fileSizeInBytes,
        mimeType: mimeType,
        fileName: fileName,
      },
    ];
    return {
      data: {
        metaData: metaData,
        dataLimit: user_data_usage.dataLimit,
        dataUsed: user_data_usage.dataUsed,
        totalSize: fileSizeInBytes,
      }
    };
  }
};

module.exports = async (path, publicKey) => {
  try {
    return await getCosting(path, publicKey);
  } catch (error) {
    throw new Error(error.message);
  }
};
