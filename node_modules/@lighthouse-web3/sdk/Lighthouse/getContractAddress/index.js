const lighthouseConfig = require("../../lighthouse.config");

module.exports = (network) => {
  return {data: lighthouseConfig[network]["lighthouse_contract_address"]};
};
