export interface Task {
  address: string;

  bountyAmount: string;
  bountyOwner: string;

  // tx 1
  name: string;
  description: string;
  dataCID: string;

  // tx 2
  bountyHunter: string;
  zkeyCID: string;
  circomCID: string;
  verifier: string;
  a: any;
  b: Array<Array>;
  c: Array;
  hashedInput: Array;

  // tx 3
  isCompleted: boolean;

  // tx 4
  input: Array;
}
