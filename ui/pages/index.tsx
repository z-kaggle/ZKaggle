import TopBar from "../components/TopBar";
import { css } from "@emotion/react";
import FlowCard from "../components/FlowCard";
import NavBar from "../components/NavBar";
import Head from "next/head";
import MainFlow from "../components/MainFlow";
import React, { useEffect } from "react";
import { Props } from "../typings";
import Link from "next/link";
import Data from "../MOCK_DATA.json";
import { useContract, useContractEvent, useContractRead } from "wagmi";
import BountyFactory from "../BountyFactory.json";
import Bounty from "../Bounty.json";
import { useProvider, useSigner } from "wagmi";

const Home = ({ tasks }: Props) => {
  const [taskAddress, setTaskAddress] = React.useState([]);

  const provider = useProvider();
  const signer = useSigner();

  const bountyFactory = useContract({
    address: BountyFactory.address,
    abi: BountyFactory.abi,
    signerOrProvider: provider,
  });

  // const bounty = useContract({
  //   address: taskAddress,
  //   abi: Bounty.abi,
  // });

  // set up contract listener
  useContractEvent({
    address: BountyFactory.address,
    abi: BountyFactory.abi,
    eventName: "BountyCreated",
    listener() {},
  });

  useEffect(() => {
    // load in all tasks from the contract
    const loadTasks = async () => {
      setTaskAddress(await bountyFactory?.bounties(1));
      console.log(taskAddress);
    };
    loadTasks();
  }, []);

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
          {tasks.map((task) => (
            <Link key={task.id} href="">
              <FlowCard task={task}></FlowCard>
            </Link>
          ))}
        </div>
      </MainFlow>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const tasks = Data;
  return {
    props: {
      tasks,
    },
  };
};
