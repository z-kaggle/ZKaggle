# ZKaggle
Bounty platform for incentivized decentralized computing on FVM

Deployed on Hyperspace testnet: https://zkaggle.vercel.app/

## Project Description
This project makes decentralized computing not only available for storage providers, but for everyone who wants to share their processing power and/or monetize their proprietary models. Our browser-based frontend allows bounty providers to upload their data to Filecoin and set up a computing task with bounty rewards. Bounty hunters can browse all open bounties, download the data onto their local machine, and compute. When they are ready to submit, they construct a ZK proof to submit the hashed computed results on-chain. Bounty providers will then review the submission and release the bounty. Last but not least, bounty hunters can claim their rewards by providing the pre-image of the hashed computed results. ZKP serves two purposes here: (1) to keep the proof of computation succinct, and (2) to allow bounty hunters to monetize private models with credibility.

## How it's Made
We use RainbowKit + wagmi + Next.js to build the frontend. Lighthouse SDK is used to handle file uploading and encryption. It has helped such that we do not need to handle storage deals by ourselves. Also, files that bounty hunters upload can only be viewed by bounty providers, but not by anyone else that hasn’t paid. We used the FEVM hardhat kit to develop our smart contracts. The ZKP tech stack consists of circom, which is the domain-specific language for writing ZKP circuits, and snarkjs, which is the library to produce ZK proofs from circuits, used both locally and on the browser.

Presentation deck linked [here](https://www.canva.com/design/DAFZaRE7dgA/OSL5YjvS_jyt1WvqzEB8GQ/view?utm_content=DAFZaRE7dgA&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink) for more information.