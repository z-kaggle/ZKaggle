const Conf = require("conf");
const chalk = require("chalk");

const getNetwork = require("../Utils/getNetwork");

const config = new Conf();

module.exports = {
  command: "wallet",
  desc: "Returns wallet public address",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\r\nlighthouse-web3 wallet\r\n" +
          chalk.green("Description: ") +
          "Returns wallet public address and current network\r\n"
      );
    } else {
      try {
        if (!config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")) {
          throw new Error("Please import wallet first!");
        }

        console.log(
          chalk.yellow("Public Key:") +
            Array(4).fill("\xa0").join("") +
            config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
        );

        console.log(
          chalk.yellow("Network:") +
            Array(7).fill("\xa0").join("") +
            getNetwork()
        );
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
};
