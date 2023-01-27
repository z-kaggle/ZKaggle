import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit"; 

const Home: NextPage = () => {
  return (
    <div>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ConnectButton />
      </div>
    </div>
  );
};

export default Home;
