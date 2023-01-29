const Conf = require("conf");
const chalk = require("chalk");
const { isCID } = require("../Utils/util");

const fs = require("fs");
const ethers = require("ethers");
const { default: axios } = require("axios");

const config = new Conf();
const lighthouse = require("../Lighthouse");
const readInput = require("../Utils/readInput");
const lighthouseConfig = require("../lighthouse.config");

const sign_auth_message = async (publicKey, privateKey) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  const messageRequested = await lighthouse.getAuthMessage(publicKey);
  const signedMessage = await signer.signMessage(messageRequested.data.message);
  return signedMessage;
};

module.exports = {
  command: "decrypt-file [cid] [output]",
  desc: "Decrypt and download a file",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\r\nlighthouse-web3 decrypt-file [cid]\r\n" +
          chalk.green("Description: ") +
          "Decrypt and download a file\r\n"
      );
    } else {
      try {
        if (!config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")) {
          throw new Error("Please import wallet first!");
        }
        
        // get file details
        let fileName = "tempFile";
        if(!argv.output){
          const fileDetails = (
            await axios.get(
              lighthouseConfig.lighthouseAPI +
                "/api/lighthouse/file_info?cid=" +
                argv.cid
            )
          ).data;
          if (!fileDetails) {
            throw new Error("Unable to get CID details.");
          }
          fileName = fileDetails.fileName;
        } else{
          fileName = argv.output;
        }

        // Get key
        options = {
          prompt: "Enter your password: ",
          silent: true,
          default: "",
        };
        const password = await readInput(options);
        const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
          config.get("LIGHTHOUSE_GLOBAL_WALLET"),
          password.trim()
        );

        const signedMessage = await sign_auth_message(
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
          decryptedWallet.privateKey
        );
        const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
          argv.cid,
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
          signedMessage
        );

        // Decrypt
        const decryptedFile = await lighthouse.decryptFile(
          argv.cid,
          fileEncryptionKey.data.key
        );

        // save file
        fs.createWriteStream(fileName).write(
          Buffer.from(decryptedFile)
        );
        console.log(
          chalk.greenBright(`${fileName} Decrypted`)
        );
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
  builder: function (yargs) {
    yargs
      .option("c", {
        alias: "cid",
        demandOption: true,
        describe: "file CID",
        type: "string",
      })
      .option("o", {
        alias: "output",
        demandOption: false,
        describe: "Output name",
        type: "string",
      })
      .help()
      .check((argv, options) => {
        if (!isCID(argv.cid)) {
          console.log(chalk.red("Invalid CID"));
          throw new Error("Invalid CID");
        }
        return true;
      });
  },
};
