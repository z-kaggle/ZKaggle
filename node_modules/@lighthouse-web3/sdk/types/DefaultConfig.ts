enum NetworkType {
  mainnet = "mainnet",
  testnet = "testnet",
}

export interface NetworkUserInfo {
  symbol: string;
  rpc: string;
  chain_id: number;
  lighthouse_contract_address?: string;
  deposit_contract_address?: string;
}

export type Networks = {
  [networkName: string]: NetworkUserInfo | undefined;
};

export type DefaultConfig = {
  URL: string;
  network: NetworkType;
  mainnet: Networks;
  testnet: Networks;
};
