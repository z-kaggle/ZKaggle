export interface Task {
  name: string;
  requirements: string;
  bounty: number;
  id: number;
  status: number;
}

export interface Props {
  tasks: [Task];
}
