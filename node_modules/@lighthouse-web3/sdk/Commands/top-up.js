const Conf = require("conf");
const chalk = require("chalk");
const ethers = require("ethers");
const Spinner = require("cli-spinner").Spinner;

const lighthouse = require("../Lighthouse");
const byteToSize = require("../Utils/byteToSize");
const getNetwork = require("../Utils/getNetwork");
const readInput = require("../Utils/readInput");

const lighthouseConfig = require("../lighthouse.config");
const config = new Conf();

module.exports = {
  command: "top-up",
  desc: "top up balance",
  handler: async function (argv) {
    try {
      if (!config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")) {
        throw new Error("Wallet not created/imported");
      }
      let spinner = new Spinner("");
      spinner.start();

      const balance = await lighthouse.getBalance(
        config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
      );

      spinner.stop();
      process.stdout.clearLine();
      process.stdout.cursorTo(0);

      if (!balance) {
        throw new Error("Error fetching balance!");
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

      if (!decryptedWallet) {
        throw new Error("Incorrect password!");
      }

      const network = getNetwork();

      if (network === "polygon-testnet") {
        const provider = new ethers.providers.JsonRpcProvider(
          lighthouseConfig[network]["rpc"]
        );

        const contractABI = [
          {
            constant: true,
            inputs: [{ name: "account", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "decimals",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
        ];

        const contractDepositABI = [
          {
            inputs: [
              {
                internalType: "address",
                name: "_tokenAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
              },
            ],
            name: "addDeposit",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "_address",
                type: "address",
              },
            ],
            name: "getAvailableSpace",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ];

        const contractUSDC = new ethers.Contract(
          lighthouseConfig[network]["usdc_contract_address"],
          contractABI,
          new ethers.Wallet(decryptedWallet.privateKey, provider)
        );
        const contractDeposit = new ethers.Contract(
          lighthouseConfig[network]["deposit_contract_address"],
          contractDepositABI,
          new ethers.Wallet(decryptedWallet.privateKey, provider)
        );
        console.log(
          chalk.yellow("USDC Balance: ") +
            Array(2).fill("\xa0").join("") +
            ethers.utils.formatUnits(
              await contractUSDC.balanceOf(
                config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
              ),
              lighthouseConfig[network]["usd_contract_decimal"]
            )
        );
        console.log(
          chalk.yellow("Current contract Storage Balance: ") +
            (
              (await contractDeposit.getAvailableSpace(
                config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
              )) / lighthouseConfig.gbInBytes
            ).toFixed(2) +
            "GB"
        );

        amount = ethers.utils
          .parseUnits(String(argv.amount), await contractUSDC.decimals())
          .toString();

        spinner = new Spinner(
          `Getting Approval to spent $${String(argv.amount)}`
        );
        spinner.start();

        let tx = await contractUSDC.approve(
          lighthouseConfig[network]["deposit_contract_address"],
          amount
        );
        tx = await tx.wait();
        spinner.stop();

        spinner = new Spinner(`Request top-up for  $${String(argv.amount)}`);
        spinner.start();
        tx = await contractDeposit.addDeposit(
          lighthouseConfig[network]["usdc_contract_address"],
          amount,
          {
            gasLimit: 500000,
          }
        );

        tx = await tx.wait();
        spinner.stop();

        console.log(
          "\n" +
            chalk.green("successful: ") +
            lighthouseConfig[network].scan +
            tx.transactionHash
        );
      } else {
        console.log(
          chalk.yellow(network) + ": Network not Supported yet for top up"
        );
      }
    } catch (error) {
      console.log(chalk.red(error.message));
    }
  },
  builder: function (yargs) {
    yargs
      .option("n", {
        alias: "network",
        describe: "network Account",
        type: "string",
      })
      .option("a", {
        alias: ["am", "amount", "value"],
        describe: "Account to top-up",
        type: "number",
        demandOption: true,
      })
      .help()
      .check((argv, options) => {
        return true;
      });
  },
};
