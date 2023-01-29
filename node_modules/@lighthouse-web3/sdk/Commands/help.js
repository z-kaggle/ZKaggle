const Conf = require("conf");
const chalk = require("chalk");
const packageJson = require("package-json");
const { version } = require("../package.json");

const config = new Conf();

const showHelp = () => {
  return (
    chalk.yellow("Welcome to lighthouse-web3\r\n\r\n") +
    "Usage: lighthouse-web3" +
    chalk.cyan(" [command] ") +
    chalk.green("[options]\r\n\r\n") +
    chalk.green("Commands (alias)") +
    chalk.grey(Array(21).fill("\xa0").join("") + "Description") +
    "\r\nwallet" +
    Array(31).fill("\xa0").join("") +
    "Returns wallet public address" +
    "\r\ncreate-wallet" +
    Array(24).fill("\xa0").join("") +
    "Creates a new wallet" +
    "\r\nimport-wallet" +
    Array(24).fill("\xa0").join("") +
    "Import an existing wallet" +
    "\r\nwallet-forget" +
    Array(24).fill("\xa0").join("") +
    "Remove previously saved wallet" +
    "\r\nreset-password" +
    Array(23).fill("\xa0").join("") +
    "Change your password" +
    "\r\nbalance" +
    Array(30).fill("\xa0").join("") +
    "Get your data usage" +
    "\r\nupload" +
    Array(31).fill("\xa0").join("") +
    "Upload a file" +
    "\r\nupload-encrypted" +
    Array(21).fill("\xa0").join("") +
    "Upload a file with encryption" +
    "\r\ndecrypt-file" +
    Array(25).fill("\xa0").join("") +
    "Decrypt and download the file" +
    "\r\nshare-file" +
    Array(27).fill("\xa0").join("") +
    "Share direct access to the file" +
    "\r\nrevoke-access" +
    Array(24).fill("\xa0").join("") +
    "Revoke direct access to the file" +
    "\r\ndeal-status" +
    Array(26).fill("\xa0").join("") +
    "Get storage filecoin deal status" +
    "\r\nget-uploads" +
    Array(26).fill("\xa0").join("") +
    "Get details of file uploaded" +
    "\r\napi-key" +
    Array(30).fill("\xa0").join("") +
    "Get new api key\r\n" +
    chalk.cyan("\r\nOptions") +
    "\r\n--network" +
    Array(28).fill("\xa0").join("") +
    "Set network\r\n" +
    "--help" +
    Array(31).fill("\xa0").join("") +
    "Help for a specific command command\r\n" +
    chalk.magenta("\r\nExample") +
    "\r\nNew api-key" +
    Array(7).fill("\xa0").join("") +
    "lighthouse-web3 api-key --new\r\n" +
    "\r\nChange Network" +
    Array(4).fill("\xa0").join("") +
    "lighthouse-web3 --network polygon\r\n" +
    Array(18).fill("\xa0").join("") +
    "lighthouse-web3 --network fantom-testnet\r\n" +
    Array(18).fill("\xa0").join("") +
    "lighthouse-web3 --network binance-mainnet\r\n" +
    "\r\nCreate wallet" +
    Array(5).fill("\xa0").join("") +
    "lighthouse-web3 create-wallet\r\n" +
    "\r\nImport wallet" +
    Array(5).fill("\xa0").join("") +
    "lighthouse-web3 import-wallet 0x7e9fd9a0311f69e842a05a2531f1038e2b543293a9c3dd46902dbc6107da8600\r\n"
  );
};

module.exports = {
  command: "$0",
  builder: {
    network: {
      describe: "Network to use, default: polygon mainnet",
      type: "String",
    },
  },
  handler: async function (argv) {
    if (argv.network) {
      switch (argv.network.toString()) {
        case "polygon":
        case "polygon-mainnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "polygon");
          console.log(chalk.green("Switched to polygon mainnet"));
          break;
        case "fantom":
        case "fantom-mainnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "fantom");
          console.log(chalk.green("Switched to fantom mainnet"));
          break;
        case "binance":
        case "binance-mainnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "binance");
          console.log(chalk.green("Switched to binance mainnet"));
          break;
        case "optimism":
        case "optimism-mainnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "optimism");
          console.log(chalk.green("Switched to optimism mainnet"));
          break;
        case "polygon-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "polygon-testnet");
          console.log(chalk.green("Switched to polygon testnet"));
          break;
        case "fantom-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "fantom-testnet");
          console.log(chalk.green("Switched to fantom testnet"));
          break;
        case "binance-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "binance-testnet");
          console.log(chalk.green("Switched to binance testnet"));
          break;
        case "optimism-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "optimism-testnet");
          console.log(chalk.green("Switched to optimism testnet"));
          break;
        case "wallaby-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "wallaby-testnet");
          console.log(chalk.green("Switched to wallaby testnet"));
          break;
        default:
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "polygon");
          console.log(chalk.green("Switched to polygon mainnet"));
      }
    } else {
      console.log(showHelp());

      const response = await packageJson("@lighthouse-web3/sdk");
      if (response) {
        console.log(
          chalk.yellow("Current Version: ") +
            version +
            "\r\n" +
            chalk.yellow("Latest Version : ") +
            response.version
        );
        if (version !== response.version) {
          console.log(
            chalk.yellow("To update run  : ") + "npm i -g @lighthouse-web3/sdk"
          );
        }
      }
    }
  },
};
