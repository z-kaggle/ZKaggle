import type { NextPage } from "next";
import TopBar from "./components/TopBar";
import NavBar from "./components/NavBar";
import { css } from "@emotion/react";
import OutlinedCard from "./components/FlowCard";
import MainFlow from "./components/MainFlow";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { fetchBalance } from "@wagmi/core";

interface Task {
  name: string;
  requirements: string;
  bounty: number;
}

const MySpacePage: NextPage = () => {
  const { address, connector, isConnected } = useAccount();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    setConnected(isConnected);
    const getBalance = async () => {
      const balance = await fetchBalance({
        address: "0x2C1189dDAB06e04f0649A7668E4141565d492665",
      });
      return balance;
    };
    getBalance().then((balance) => {
      console.log(balance);
    });
  });

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
          {/* hytration poroblem */}
          {connected ? <OutlinedCard /> : <p>disconnected</p>}
        </div>
      </MainFlow>
    </div>
  );
};

export default MySpacePage;
