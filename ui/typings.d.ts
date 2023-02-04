export interface Task {
  address: string;

  bountyAmount: string;
  bountyOwner: string;

  completedStep: number;

  // tx 1
  name: string;
  description: string;
  dataCID: string;

  // tx 2
  bountyHunter: string;
  zkeyCID: string;
  circomCID: string;
  verifierCID: string;
  verifier: string;
  
  // a: [string, string];
  // b: [[string, string], [string, string]];
  // c: [string, string];
  hashedInput: string;

  // tx 3
  isCompleted: boolean;

  // tx 4
  input0: string;
  input1: string;
}
