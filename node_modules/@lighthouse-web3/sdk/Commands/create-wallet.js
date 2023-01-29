const chalk = require("chalk");
const Conf = require("conf");
const ethers = require("ethers");
const fs = require("fs");

const lighthouse = require("../Lighthouse");
const readInput = require("../Utils/readInput");

const config = new Conf();

module.exports = {
  command: "create-wallet",
  desc: "Creates a new wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\r\nlighthouse-web3 create-wallet\r\n" +
          chalk.green("Description: ") +
          "Creates a new wallet\r\n" +
          chalk.magenta("Example:") +
          Array(5).fill("\xa0").join("") +
          "lighthouse-web3 create-wallet\r\n"
      );
    } else {
      try {
        const options = {
          prompt: "Set a password for your wallet:",
          silent: true,
        };

        const password = await readInput(options);
        const encryptedWallet = (await lighthouse.createWallet(password.trim())).data.encryptedWallet;
        const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
          encryptedWallet,
          password.trim()
        );

        const publicKey = decryptedWallet.address;
        const privateKey = decryptedWallet.privateKey;

        if (!encryptedWallet) {
          throw new Error("Creating Wallet Failed!");
        }
        const saveWallet = {
          publicKey: publicKey,
          privateKey: privateKey,
        };

        fs.writeFile(
          "wallet.json",
          JSON.stringify(saveWallet, null, 4),
          (err) => {
            if (err) {
              throw new Error("Saving Wallet Failed!");
            } else {
              config.set("LIGHTHOUSE_GLOBAL_WALLET", encryptedWallet);
              config.set("LIGHTHOUSE_GLOBAL_PUBLICKEY", publicKey);

              console.log(
                chalk.cyan("Public Key: " + publicKey) +
                  chalk.green("\r\nWallet Created!")
              );
            }
          }
        );
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
};
