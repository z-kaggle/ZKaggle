/* istanbul ignore file */
const addCid = require("./addCid");
const dealStatus = require("./dealStatus");
const getApiKey = require("./getApiKey");
const getBalance = require("./getBalance");
const getUploads = require("./getUploads");
const createWallet = require("./createWallet");
const getFileInfo = require("./getFileInfo");

// Get Contract Address
const getContractAddress = require("./getContractAddress");

// Encryption BLS
const shareFile = require("./encryption/shareFile");
const getAuthMessage = require("./encryption/getAuthMessage");
const revokeFileAccess = require("./encryption/revokeFileAccess");
const accessCondition = require("./encryption/accessConditionFile");
const fetchEncryptionKey = require("./encryption/fetchEncryptionKey");
const getAccessConditions = require("./encryption/getAccessConditions");


if (typeof window === "undefined") {
  const upload = require("./upload");
  const getQuote = require("./getQuote");
  const uploadBuffer = require("./upload/uploadBuffer");
  const uploadText = require("./upload/uploadText");
  const uploadEncrypted = require("./uploadEncrypted/node");
  const decryptFile = require("./uploadEncrypted/node/decryptFile");
  const textUploadEncrypted = require("./uploadEncrypted/node/textUploadEncrypted");

  module.exports = {
    upload,
    addCid,
    getApiKey,
    uploadBuffer,
    createWallet,
    getQuote,
    getBalance,
    getUploads,
    dealStatus,
    getContractAddress,
    getFileInfo,
    uploadEncrypted,
    decryptFile,
    fetchEncryptionKey,
    getAuthMessage,
    shareFile,
    accessCondition,
    revokeFileAccess,
    textUploadEncrypted,
    getAccessConditions,
    uploadText
  };
} else {
  const upload = require("./upload/browser");
  const uploadText = require("./upload/uploadTextBrowser");
  const decryptFile = require("./uploadEncrypted/browser/decryptFile");
  const uploadEncrypted = require("./uploadEncrypted/browser/index.js");

  module.exports = {
    upload,
    addCid,
    getApiKey,
    getBalance,
    getUploads,
    dealStatus,
    getContractAddress,
    getFileInfo,
    uploadText,
    uploadEncrypted,
    decryptFile,
    fetchEncryptionKey,
    getAuthMessage,
    shareFile,
    accessCondition,
    revokeFileAccess,
    getAccessConditions
  };
}
