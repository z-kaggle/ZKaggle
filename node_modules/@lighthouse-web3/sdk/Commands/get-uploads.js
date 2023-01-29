const chalk = require("chalk");
const Conf = require("conf");

const bytesToSize = require("../Utils/byteToSize");
const lighthouse = require("../Lighthouse");

const config = new Conf();

module.exports = {
  command: "get-uploads",
  desc: "Get details of file uploaded",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\r\nlighthouse-web3 get-uploads\r\n" +
          chalk.green("Description: ") +
          "Get details of file uploaded\r\n"
      );
    } else {
      try {
        if (!config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")) {
          throw new Error("Wallet not created/imported");
        }

        const response = (await lighthouse.getUploads(
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
        )).data.uploads;

        console.log(
          "\r\n" +
            Array(4).fill("\xa0").join("") +
            chalk.yellow("CID") +
            Array(47).fill("\xa0").join("") +
            chalk.yellow("File Name") +
            Array(5).fill("\xa0").join("") +
            chalk.yellow("File Size")
        );
        for (let i = 0; i < response.length; i++) {
          console.log(
            Array(4).fill("\xa0").join("") +
              response[i]["cid"] +
              Array(4).fill("\xa0").join("") +
              response[i]["fileName"].substring(0, 10) +
              Array(4).fill("\xa0").join("") +
              bytesToSize(response[i]["fileSizeInBytes"]) +
              "\r\n"
          );
        }
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
};
