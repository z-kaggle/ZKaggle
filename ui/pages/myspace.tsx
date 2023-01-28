import type { NextPage } from "next";
import TopBar from "./components/TopBar";
import NavBar from "./components/NavBar";
import { css } from "@emotion/react";
import OutlinedCard from "./components/FlowCard";
import MainFlow from "./components/MainFlow";

interface Task {
  name: string;
  requirements: string;
  bounty: number;
}

const MySpacePage: NextPage = () => {
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
            margin-left: 10%;
            margin-right: 10px;
            margin-top: 20px;
            margin-bottom: 20px;
          `}
        >
          <OutlinedCard />
          <OutlinedCard />
          <OutlinedCard />
        </div>
      </MainFlow>
    </div>
  );
};

export default MySpacePage;
