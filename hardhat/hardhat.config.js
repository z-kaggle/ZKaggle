require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require("dotenv").config();

const { PRIVATE_KEY: GOERLI_PRIVATE_KEY, ALCHEMY_API_KEY } = process.env;

module.exports = {
    solidity: {
        version: "0.8.17",
        optimizer: {
            enabled: true,
            runs: 1000,
        }
    },
    networks: {
        hardhat: {
            allowUnlimitedContractSize: true,
            gas: 100000000,
            blockGasLimit: 0x1fffffffffffff,
        },
        goerli: {
            allowUnlimitedContractSize: true,
            gas: 100000000,
            blockGasLimit: 0x1fffffffffffff,
            url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            accounts: [`${GOERLI_PRIVATE_KEY}`],
        },
    },
    namedAccounts: {
        deployer: 0,
    },
    paths: {
        deploy: "deploy",
        deployments: "deployments",
    },
    mocha: {
        timeout: 1000000
    }
};
