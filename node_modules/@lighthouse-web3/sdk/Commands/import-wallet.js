const axios = require("axios");
const Conf = require("conf");
const chalk = require("chalk");
const ethers = require("ethers");
const { isPrivateKey } = require("../Utils/util");

const readInput = require("../Utils/readInput");
const lighthouseConfig = require("../lighthouse.config");

const config = new Conf();

module.exports = {
  command: "import-wallet [privateKey]",
  desc: "Import an existing wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\r\nlighthouse-web3 import-wallet\r\n" +
          chalk.green("Description: ") +
          "Import an existing wallet\r\n" +
          chalk.magenta("Example: \r\n") +
          Array(5).fill("\xa0").join("") +
          "lighthouse-web3 import-wallet --key 0xlkjhcf1721e6e1828a15c72c1d2aa80c633e45574cb60f5e821681999f3d1700\r\n"
      );
    } else {
      try {
        const privateKey = argv.privateKey;
        const options = {
          prompt: "Set a password for your wallet:",
          silent: true,
          default: "",
        };

        const password = await readInput(options);
        const wallet = new ethers.Wallet(privateKey);
        if (!wallet) {
          throw new Error("Importing Wallet Failed!");
        }
        const _ = await axios.get(
          lighthouseConfig.lighthouseAPI +
            `/api/auth/get_message?publicKey=${wallet.address}`
        );
        const encryptedWallet = await wallet.encrypt(password.trim());

        config.set("LIGHTHOUSE_GLOBAL_WALLET", encryptedWallet);
        config.set("LIGHTHOUSE_GLOBAL_PUBLICKEY", wallet.address);

        console.log(
          chalk.cyan("Public Key: " + wallet.address) +
            chalk.green("\r\nWallet Imported!")
        );
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
  builder: function (yargs) {
    yargs
      .option("k", {
        alias: ["privateKey", "key"],
        demandOption: true,
        describe: "account's private Key",
        type: "string",
      })
      .help()
      .check((argv, options) => {
        if (!isPrivateKey(argv.privateKey.replace("0x", ""))) {
          throw new Error("Invalid PrivateKey");
        }
        return true;
      });
  },
};
