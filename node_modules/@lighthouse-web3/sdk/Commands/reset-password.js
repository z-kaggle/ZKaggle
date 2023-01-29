const chalk = require("chalk");
const Conf = require("conf");
const ethers = require("ethers");

const readInput = require("../Utils/readInput");
const config = new Conf();

module.exports = {
  command: "reset-password",
  desc: "Change password of your wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 reset-password\r\n" +
          chalk.green("Description: ") +
          "Change password of your wallet"
      );
    } else {
      try {
        let options = {
          prompt: "Enter old password for your wallet:",
          silent: true,
          default: "",
        };
        const oldPassword = await readInput(options);
        const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
          config.get("LIGHTHOUSE_GLOBAL_WALLET"),
          oldPassword.trim()
        );
        if (!decryptedWallet) {
          throw new Error("Incorrect Password!");
        }

        options = {
          prompt: "Set new password for your wallet:",
          silent: true,
          default: "",
        };

        const newPassword = await readInput(options);
        const encryptedWallet = await decryptedWallet.encrypt(
          newPassword.trim()
        );
        if (!encryptedWallet) {
          throw new Error("Password reset failed!");
        }

        config.set("LIGHTHOUSE_GLOBAL_WALLET", encryptedWallet);
        config.set("LIGHTHOUSE_GLOBAL_PUBLICKEY", decryptedWallet.address);

        console.log(
          chalk.cyan("Public Key: " + decryptedWallet.address) +
            chalk.green("\r\nPassword reset successful")
        );
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
};
