import { css } from "@emotion/react";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import Bounty from "../Bounty.json";
import BountyFactory from "../BountyFactory.json";
import FlowCard from "../components/FlowCard";
import MainFlow from "../components/MainFlow";
import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import { Task } from "../typings";

interface Props {
  tasks: Task[];
}

const SubmissionsPage = ({ tasks }: Props) => {
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
      `}
    >
      <TopBar />
      <NavBar />
      <MainFlow>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-left: 10%;
            margin-right: 10px;
            margin-top: 20px;
            margin-bottom: 20px;
          `}
        >
          {/* if connected, only show tasks that are created by the connected
          address this filter can only be done on client side */}
          {connected ? (
            tasks
              .filter((task) => task.bountyHunter === address)
              .map((task, index) => (
                <FlowCard key={index} task={task} expanded={true}></FlowCard>
              ))
          ) : (
            <h1>🚨Please connect your wallet to continue!</h1>
          )}
        </div>
      </MainFlow>
    </div>
  );
};

export default SubmissionsPage;

export const getServerSideProps = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://api.hyperspace.node.glif.io/rpc/v1"
  );
  const bountyFactory = new Contract(
    BountyFactory.address,
    BountyFactory.abi,
    provider
  );

  // fetching all task address by querying the factory contract
  const tasks = [];
  const count = Number(await bountyFactory?.bountyCount());
  console.log("count", count);
  for (let i = count - 1; i >= 0; i--) {
    const address = await bountyFactory?.bounties(i);
    tasks.push({
      address: address,
    } as Task);
  }

  // fetching all task details
  const results = tasks.map(async (task: Task) => {
    const bounty = new Contract(task.address, Bounty.abi, provider);
    task.isCompleted = await bounty?.isComplete();
    task.name = await bounty?.name();
    task.bountyAmount = ethers.utils.formatEther(
      await provider.getBalance(task?.address)
    );
    task.description = await bounty?.description();
    task.bountyHunter = await bounty?.bountyHunter();
  });

  await Promise.all(results);
  return {
    props: { tasks },
  };
};
