export interface Task {
  address: string;
  event: string;
  step: number;

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

  // Todo: need to confirm the type
  a: Array;
  b: Array<Array>;
  c: Array;
  hashedInput: Array;

  // tx 3
  isCompleted: boolean;

  // tx 4
  input: Array;
}
