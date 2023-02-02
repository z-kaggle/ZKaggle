import { css } from "@emotion/react";
import { Button, Step, StepLabel, Stepper } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { useAccount, useContract } from "wagmi";
import { useContractEvent } from "wagmi";
import { useProvider } from "wagmi";

import BountyFactory from "../BountyFactory.json";
import InitializeStep from "../components/CreateBounty/InitializeStep";
import MainFlow from "../components/MainFlow";
import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";

const stepTitles = ["Initialize", "Processing", "Verify", "Check Out"];

const CreateBounty: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = React.useState(false);
  const provider = useProvider();
  const taskRouter = useRouter();

  const bountyFactory = useContract({
    address: BountyFactory.address,
    abi: BountyFactory.abi,
    signerOrProvider: provider,
  });

  // useContractEvent({
  //   address: BountyFactory.address,
  //   abi: BountyFactory.abi,
  //   eventName: "BountyCreated",
  //   async listener() {
  //     taskRouter.push(`/tasks/${await bountyFactory?.bounties(0)}`);
  //     console.log("BountyCreated, Jumping now!");
  //   },
  // });

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
            margin-left: 10%;
            margin-right: 10px;
            margin-top: 20px;
            margin-bottom: 20px;
          `}
        >
          <Stepper activeStep={0} alternativeLabel>
            {stepTitles.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {connected ? (
            <InitializeStep />
          ) : (
            <h1>🚨Please connect your wallet to continue!</h1>
          )}
        </div>
      </MainFlow>
    </div>
  );
};

export default CreateBounty;
