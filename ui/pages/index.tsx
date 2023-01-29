import TopBar from "../components/TopBar";
import { css } from "@emotion/react";
import FlowCard from "../components/FlowCard";
import NavBar from "../components/NavBar";
import Head from "next/head";
import MainFlow from "../components/MainFlow";
import { useEffect } from "react";
import { Props } from "../typings";
import Link from "next/link";
import Data from "../MOCK_DATA.json";
import { useContractEvent, useContractRead } from "wagmi";

const Home = ({ tasks }: Props) => {
  useEffect(() => {
    // // load in all tasks from the contract
    // const { data, isError, isLoading } = useContractRead({
    //   address: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
    //   // abi: wagmigotchiABI,
    //   functionName: "getHunger",
    // });
    // // set up contract listener
    // useContractEvent({
    //   address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    //   // abi: ensRegistryABI,
    //   eventName: "NewOwner",
    //   listener(node, label, owner) {
    //     console.log(node, label, owner);
    //   },
    // });
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
