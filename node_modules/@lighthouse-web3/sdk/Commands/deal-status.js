const chalk = require("chalk");
const bytesToSize = require("../Utils/byteToSize");
const lighthouse = require("../Lighthouse");
const { isCID } = require("../Utils/util");

const showResponse = (cid, dealStatus) => {
  console.log(
    chalk.yellow("\r\nCID:") +
      Array(9).fill("\xa0").join("") +
      cid +
      chalk.yellow("\r\nSize:") +
      Array(8).fill("\xa0").join("") +
      bytesToSize(dealStatus[0]["content"]) +
      "\r\n"
  );

  console.log(
    Array(20).fill("\xa0").join("") +
      chalk.yellow("Miner : ") +
      Array(10).fill("\xa0").join("") +
      chalk.yellow("DealId: ")
  );

  for (let i = 0; i < dealStatus.length; i++) {
    let gap = 10 + (8 - dealStatus[i]["miner"].length);
    console.log(
      Array(20).fill("\xa0").join("") +
        dealStatus[i]["miner"] +
        Array(gap).fill("\xa0").join("") +
        dealStatus[i]["dealId"]
    );
  }
  console.log(
    chalk.green("\r\nView deals at filfox URL:\r\n") +
    Array(4).fill("\xa0").join("") +
    "https://filfox.info/en/deal/" +
    dealStatus[0]["dealId"]
  );
};

module.exports = {
  command: "deal-status [cid]",
  desc: "Get sfilecoin deal status of a CID",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 deal-status <cid>\r\n" +
          chalk.green("\r\nDescription: ") +
          "Get storage deal status of a CID"
      );
    } else {
      try {
        const dealStatus = (await lighthouse.dealStatus(argv.cid)).data.dealStatus;
        dealStatus.length===0?
          console.log("Deal creation in progress")
          :
          showResponse(argv.cid, dealStatus)
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
