import type { NextPage } from "next";
import TopBar from "./components/TopBar";
import { css } from "@emotion/react";
import MySpace from "./components/MySpace";
import OutlinedCard from "./components/FlowCard";

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
      {/* <NavBar /> */}

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
      </div>
    </div>
  );
};

export default MySpacePage;
