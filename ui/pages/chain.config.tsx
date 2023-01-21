import { Chain } from "wagmi";

export const filecoin: Chain = {
  id: 314,
  name: 'Filecoin Mainnet',
  network: 'filecoin-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'filecoin',
    symbol: 'FIL',
  },
  rpcUrls: {
    default: { http: ['https://api.node.glif.io/'],},
    public: { http: ['https://api.node.glif.io/'],},
  },
  blockExplorers: {
    default: { name: 'Filfox', url: 'https://filfox.info/en' },
    filscan: { name: 'Filscan', url: 'https://filscan.io',}, 
    filscout:{ name: 'Filscout', url: 'https://filscout.io/en',}
  },
}

export const filecoinHyperspace: Chain = {
  id: 3141,
  name: 'Filecoin Hyperspace',
  network: 'filecoin-hyperspace',
  nativeCurrency: {
    decimals: 18,
    name: 'testnet filecoin',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
    public: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
  },
  blockExplorers: {
    default: { name: 'FilFox', url: 'https://hyperspace.filfox.info/en',},
    gilf: { name: 'Gilf', url: 'https://explorer.glif.io/?network=hyperspace',},
  },
};


