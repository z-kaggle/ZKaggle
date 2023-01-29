const Conf = require("conf");
const config = new Conf();

const lighthouseConfig = require("../lighthouse.config");

module.exports = () => {
  return config.get("LIGHTHOUSE_GLOBAL_NETWORK")
    ? config.get("LIGHTHOUSE_GLOBAL_NETWORK")
    : lighthouseConfig.network;
};
