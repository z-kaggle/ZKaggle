# Lighthouse <img src="https://img.shields.io/badge/BETA-v0.1.10-green"/>

Lighthouse is a permanent decentralized file storage protocol that allows the ability to pay once and store forever. While traditionally, users need to repeatedly keep track and pay for their storage after every fixed amount of time, Lighthouse manages this for them and makes sure that user files are stored forever. The aim is to move users from a rent-based cost model where they are renting their own files on cloud storage to a permanent ownership model. It is built on top of IPFS, Filecoin, and Polygon. It uses the existing miner network and storage capacity of the filecoin network.

## Installation

```bash
npm install -g @lighthouse-web3/sdk
```

## CLI Usage

```bash
# create-wallet
lighthouse-web3 create-wallet

# import-wallet
lighthouse-web3 import-wallet --key <private_key>

# wallet-forget
lighthouse-web3 wallet-forget

# api-key
lighthouse-web3 api-key --new

# balance
lighthouse-web3 balance

# upload
lighthouse-web3 upload <path>

# status
lighthouse-web3 status <cid>

# get-uploads
lighthouse-web3 get-uploads

# wallet
lighthouse-web3 wallet
```

## NodeJs Example

```javascript
const lighthouse = require("@lighthouse-web3/sdk");

// Create wallet
const wallet = await lighthouse.createWallet(
  "Password for wallet encryption"
);

// Get wallet balance
const balance = await lighthouse.getBalance(publicKey);

// Upload File
const uploadResponse = await lighthouse.upload('/home/cosmos/Desktop/wow.jpg', api-key);


Refer [GitBook](https://docs.lighthouse.storage/lighthouse-1/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
