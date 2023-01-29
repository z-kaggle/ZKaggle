export type IpfsFileResponse = {
  Name: string;
  Hash: string;
  Size: string | number;
};
export type Address = string;

export type ErrorValue = string | Array<string> | object | any;

export type MetaData = {
  fileSize: string | number;
  mimeType: string;
  fileName: string;
};

export type GetQuota = {
  metaData: MetaData[];
  dataLimit: string;
  dataUsed: string;
  totalSize: string;
};

export function upload(
  path: string,
  apiKey: string,
  uploadProgressCallback?: any
): Promise<{ data: IpfsFileResponse }>;

export function uploadBuffer(
  buffer: any,
  apiKey: string,
  mimeType?: string
): Promise<{ data: IpfsFileResponse }>;

export function uploadText(
  text: string,
  apiKey: string
): Promise<{ data: IpfsFileResponse }>;

export function uploadEncrypted(
  sourcePath: string,
  apiKey: string,
  publicKey: Address,
  signed_message: string,
  uploadProgressCallback?: any
): Promise<{ data: IpfsFileResponse }>;

export function getQuote(path: string, publicKey: Address): Promise<GetQuota>;

export function decryptFile(
  cid: string,
  fileEncryptionKey: string
): Promise<File | ArrayBuffer | any>;

export function textUploadEncrypted(
  text: string,
  apiKey: string,
  publicKey: Address,
  signed_message: string
): Promise<{ data: IpfsFileResponse; isSuccess: boolean; error: ErrorValue }>;

export type API_Key = {
  apiKey: string;
};

export function getApiKey(
  publicKey: Address,
  signedMessage: string
): Promise<{ data: API_Key }>;

export type GetBalance = {
  dataLimit: number;
  dataUsed: number;
};

export function getBalance(publicKey: string): Promise<{ data: GetBalance }>;

export type uploadInfo = {
  publicKey: Address;
  fileName: string;
  mimeType: string;
  txHash: string;
  status: string;
  createdAt: number | string;
  fileSizeInBytes: string;
  cid: string;
  id: string;
  lastUpdate: number;
  encryption: boolean;
};

export function getUploads(
  publicKey: Address,
  pageNo?: number
): Promise<{ data: { upload: uploadInfo[] } }>;

export function createWallet(): Promise<{
  data: {
    encryptedWallet: string;
  };
}>;

export function shareFile(
  publicKey: Address,
  shareTo: Array<Address>,
  cid: string,
  signedMessage: string
): Promise<{
  data: {
    shareTo: Array<Address>;
    cid: string;
    status: string;
  };
}>;

export function getAuthMessage(publicKey: Address): Promise<{
  data: {
    message: string;
  };
}>;

export function getEncryptionKeyPair(
  publicKey: Address,
  accessToken: string
): Promise<{ publicKey: Address; secretKey: string } | null>;

export function revokeFileAccess(
  publicKey: Address,
  revokeTo: Array<Address>,
  cid: string,
  signedMessage: string
): Promise<{
  data: { cid: string; revokeTo: Array<Address>; status: string };
}>;

export function fetchEncryptionKey(
  cid: string,
  publicKey: Address,
  signedMessage: string
): Promise<{
  data: { key: string };
}>;

export type ChainType = "EVM" | "evm" | "solana" | "SOLANA";

export function accessCondition(
  address: string,
  cid: string,
  signedMessage: string,
  conditions: { [key: string]: any },
  aggregator?: string,
  chainType?: ChainType
): Promise<{
  data: {
    cid: string;
    status: string;
  };
}>;

export type Base64encoded = string;

export function encryptKey(
  fileEncryptionKey: string,
  encryptionPublicKey: string | Base64encoded,
  secretKey: string | Base64encoded
): { encryptedFileEncryptionKey: Base64encoded; nonce: Base64encoded };

export function getAccessConditions(cid: string): Promise<{
  data: object;
}>;

export function decryptPassword(
  passwordEncrypted: Base64encoded,
  nonce: Base64encoded,
  encryptionPublicKey: Base64encoded | string,
  secretKey: Base64encoded | string
): string;

export type ContractAddress = string;
export type NetworkName =
  | "fantom"
  | "polygon"
  | "binance"
  | "optimism"
  | "fantom-testnet"
  | "polygon-testnet"
  | "binance-testnet"
  | "optimism-testnet"
  | "wallaby-testnet";
export function getContractAddress(network: NetworkName): {
  data: ContractAddress;
};

export function dealStatus(cid: string): Promise<{ data: { dealStatus: any } }>;

export function addCid(fileName: string, cid: string): Promise<{ data: any }>;

export function getFileInfo(cid: string): Promise<{ data: any }>;
