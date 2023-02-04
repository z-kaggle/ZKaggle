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
  verifierCID: string;
  verifier: string;

  // Todo: need to confirm the type
  a: Array<string>;
  b: Array<Array<string>>;
  c: Array<string>;
  hashedInput: Array<string>;

  // tx 3
  isCompleted: boolean;

  // tx 4
  input: Array<string>;
}
