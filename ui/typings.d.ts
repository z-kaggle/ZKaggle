export interface Task {
  name: string;
  requirements: string;
  bounty: number;
  id: number;
}

export interface Props {
  tasks: [Task];
}
