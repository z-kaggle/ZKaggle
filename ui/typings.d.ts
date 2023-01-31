export interface Task {
  address: string;

  // tx 1
  name: string;
  description: string;
  dataCID: string;

  // tx 2
  bountyHunter: string;
  zkeyCID: string;
  circomCID: string;
  verifier: string;
  a: string;
  b: string;
  c: string;
  hashedInput: string;

  // tx 3
  isCompleted: boolean;

  // tx 4
  input: string;
}

export interface Props {
  tasks: [Task];
}
