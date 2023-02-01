import React from "react";
import { css } from "@emotion/react";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import type { NextPage } from "next";
import TopBar from "../components/TopBar";
import NavBar from "../components/NavBar";

import MainFlow from "../components/MainFlow";
import InitializeStep from "../components/CreateBounty/InitializeStep";
import PublishStep from "../components/CreateBounty/PublishStep";
import ProcessingStep from "../components/CreateBounty/ProcessingStep";
import VerifyStep from "../components/CreateBounty/VerifyStep";
import CheckOutStep from "../components/CreateBounty/CheckOutStep";
import { useAccount, useContract, useContractWrite } from "wagmi";
import { useEffect, useState } from "react";
import { useContractEvent } from "wagmi";
import { Contract } from "ethers";
import BountyFactory from "../BountyFactory.json";
import Bounty from "../Bounty.json";
import { useSigner, useProvider } from "wagmi";
import { useRouter } from "next/router";

const stepTitles = [
  "Initialize",
  "Publish",
  "Processing",
  "Verify",
  "Check Out",
];

const CreateBounty: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [taskAddress, setTaskAddress] = React.useState("");
  const [connected, setConnected] = React.useState(false);
  const [access, setAccess] = React.useState(false);
  const [createBountyStep, setCreateBountyStep] = React.useState(0);
  const signer = useSigner();
  const provider = useProvider();
  const taskRouter = useRouter();

  const bountyFactory = useContract({
    address: BountyFactory.address,
    abi: BountyFactory.abi,
    signerOrProvider: provider,
  });

  const bounty = useContract({
    address: taskAddress,
    abi: Bounty.abi,
    signerOrProvider: provider,
  });

  useContractEvent({
    address: BountyFactory.address,
    abi: BountyFactory.abi,
    eventName: "BountyCreated",
    async listener() {
      taskRouter.push(`/tasks/${await bountyFactory?.bounties(0)}`);
      console.log("BountyCreated, Jumping now!");
    },
  });

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
          <Stepper activeStep={createBountyStep} alternativeLabel>
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
