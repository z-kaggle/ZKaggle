import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TopBar from "./components/TopBar";
import TaskForm from "./components/TaskForm";
import { css } from "@emotion/react";

const Home: NextPage = () => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
      `}
    >
      <TopBar />
      {/* <NavBar /> */}

      {/* <Feed/> */}
      {/* <MySpace/> */}

      {/* test for now */}
      <TaskForm />
    </div>
  );
};

export default Home;
