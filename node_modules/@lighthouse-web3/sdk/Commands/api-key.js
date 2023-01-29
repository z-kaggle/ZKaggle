const axios = require("axios");
const Conf = require("conf");
const chalk = require("chalk");
const ethers = require("ethers");

const lighthouse = require("../Lighthouse");
const readInput = require("../Utils/readInput");
const lighthouseConfig = require("../lighthouse.config");

const config = new Conf();

module.exports = {
  command: "api-key",
  desc: "Get a new api key",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 api-key\r\n" +
          chalk.green("Description: ") +
          "Get a new api key\r\n" +
          chalk.green("Options: \r\n") +
          Array(3).fill("\xa0").join("") +
          "-- new: To create new api key\r\n" +
          Array(3).fill("\xa0").join("") +
          "-- import: To import existing api-key\r\n" +
          chalk.magenta("Example: \r\n") +
          Array(5).fill("\xa0").join("") +
          "lighthouse-web3 api-key --import 937b68b8-3768-45d1-950b-30c3836785d1\r\n"
      );
    } else {
      if (argv.import) {
        config.set("LIGHTHOUSE_GLOBAL_API_KEY", argv.import);
        console.log(chalk.green("\r\nApi Key imported!!"));
      } else {
        try {
          if (config.get("LIGHTHOUSE_GLOBAL_API_KEY") && !argv.new) {
            console.log(
              chalk.yellow("\r\nApi Key: ") +
                config.get("LIGHTHOUSE_GLOBAL_API_KEY")
            );
          } else {
            if (!config.get("LIGHTHOUSE_GLOBAL_WALLET")) {
              throw new Error("Create/Import wallet first!!!");
            }

            const options = {
              prompt: "Enter your password: ",
              silent: true,
              default: "",
            };
            const password = await readInput(options);
            const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
              config.get("LIGHTHOUSE_GLOBAL_WALLET"),
              password.trim()
            );

            const verificationMessage = (
              await axios.get(
                lighthouseConfig.lighthouseAPI +
                  `/api/auth/get_message?publicKey=${decryptedWallet.address}`
              )
            ).data;
            const signedMessage = await decryptedWallet.signMessage(
              verificationMessage
            );

            const response = await lighthouse.getApiKey(
              decryptedWallet.address,
              signedMessage
            );

            config.set("LIGHTHOUSE_GLOBAL_API_KEY", response.data.apiKey);
            console.log(chalk.yellow("\r\nApi Key: ") + response.data.apiKey);
          }
        } catch (error) {
          console.log(chalk.red(error.message));
        }
      }
    }
  },
  builder: function (yargs) {
    yargs
      .option("n", {
        alias: ["new", "newKey"],
        describe: "request new key",
        type: "boolean",
      })
      .option("i", {
        alias: ["import", "importKey"],
        describe: "import Key",
        type: "string",
      })
      .check((argv, options) => {
        if (!argv.new && argv.i.length < 8) {
          throw new Error("Invalid API key");
        }
        return true;
      })
      .help("h");
  },
};
