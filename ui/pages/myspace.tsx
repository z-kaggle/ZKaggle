import { css } from "@emotion/react";
import { Contract, ethers, utils } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import Bounty from "../Bounty.json";
import BountyFactory from "../BountyFactory.json";
import ColCard from "../components/ColCard";
import MainFlow from "../components/MainFlow";
import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import { Task } from "../typings";

interface Props {
  tasks: Task[];
}

const MySpacePage = ({ tasks }: Props) => {
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
              .filter((task) => task.bountyOwner === address)
              .map((task, index) => <ColCard key={index} task={task}></ColCard>)
          ) : (
            <h1>🚨Please connect your wallet to continue!</h1>
          )}
        </div>
      </MainFlow>
    </div>
  );
};

export default MySpacePage;

export const getServerSideProps = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://api.hyperspace.node.glif.io/rpc/v1"
  );
  const bountyFactory = new Contract(
    BountyFactory.address,
    BountyFactory.abi,
    provider
  );

  // fetching all task address by browsing events
  const eventSignature = utils.id(`BountyCreated(address)`);
  const taskFilter = {
    address: BountyFactory.address,
    abi: BountyFactory.abi,
    topics: [eventSignature],
    fromBlock: 0,
  };
  const logs = await provider.getLogs(taskFilter);
  const rawtasks = logs.map((log) => {
    const task = bountyFactory?.interface.parseLog(log);
    return {
      address: task?.args[0] as string,
    } as Task;
  });

  // removing duplicate tasks and formatting
  const ids = rawtasks.map((task) => task.address);
  const tasks = rawtasks
    .filter(({ address }, index) => !ids.includes(address, index + 1))
    .reverse();

  // fetching all task details
  const results = tasks.map(async (task: Task) => {
    const bounty = new Contract(task.address, Bounty.abi, provider);
    task.name = await bounty?.name();
    task.description = await bounty?.description();
    task.dataCID = await bounty?.dataCID();
    task.bountyOwner = await bounty?.owner();
  });
  await Promise.all(results);
  return {
    props: { tasks },
  };
};
