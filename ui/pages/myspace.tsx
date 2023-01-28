import TopBar from "../components/TopBar";
import NavBar from "../components/NavBar";
import { css } from "@emotion/react";
import MainFlow from "../components/MainFlow";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Props } from "../typings";
import ColCard from "../components/ColCard";
import Link from "next/link";
import Data from "../MOCK_DATA.json";

const MySpacePage = ({ tasks }: Props) => {
  const { isConnected } = useAccount();
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
          {/* must be made into client side rendering */}
          {connected ? (
            tasks.map((task) => (
              <Link key={task.id} href="">
                <ColCard task={task}></ColCard>
              </Link>
            ))
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
  const tasks = Data;
  return {
    props: {
      tasks,
    },
  };
};
