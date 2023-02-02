import { css } from "@emotion/react";
import { Contract, ethers, utils } from "ethers";
import Head from "next/head";
import React from "react";
import { useContract } from "wagmi";
import { useProvider } from "wagmi";

import Bounty from "../Bounty.json";
import BountyFactory from "../BountyFactory.json";
import FlowCard from "../components/FlowCard";
import MainFlow from "../components/MainFlow";
import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import { Task } from "../typings";

interface Props {
  tasks: [Task];
}

const Home = ({ tasks }: Props) => {
  console.log("clienttask:");
  console.log(tasks);

  const provider = useProvider();

  const bountyFactory = useContract({
    address: BountyFactory.address,
    abi: BountyFactory.abi,
    signerOrProvider: provider,
  });

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
      `}
    >
      <Head>
        <title>ZKaggle</title>
        <link rel="icon" href="/staricon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <TopBar />
      <NavBar />
      <MainFlow>
        <div
          css={css`
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            margin-left: 10%;
            margin-right: 10px;
            margin-top: 20px;
            margin-bottom: 20px;
          `}
        >
          {tasks.map((task, index) => (
            <FlowCard key={index} task={task}></FlowCard>
          ))}
        </div>
      </MainFlow>
    </div>
  );
};

export default Home;

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
    // owner: signer,
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
  });
  await Promise.all(results);
  return {
    props: { tasks },
  };
};
