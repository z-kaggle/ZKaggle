import type { NextPage } from "next";
import TopBar from "./components/TopBar";
import { css } from "@emotion/react";
import OutlinedCard from "./components/FlowCard";
import NavBar from "./components/NavBar";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
      `}
    >
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopBar />
      <NavBar />
      <div
        css={css`
          display: flex;
          flex-direction: column;
          width: 80%;
          margin-left: 20%;
          margin-top: 60px;
        `}
      >
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
          <OutlinedCard />
          <OutlinedCard />
          <OutlinedCard />
          <OutlinedCard />
          <OutlinedCard />
          <OutlinedCard />
          <OutlinedCard />
          <OutlinedCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
