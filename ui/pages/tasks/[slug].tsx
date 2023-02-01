import React from "react";
import { css } from "@emotion/react";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import type { NextPage } from "next";
import TopBar from "../../components/TopBar";
import NavBar from "../../components/NavBar";

import MainFlow from "../../components/MainFlow";
import InitializeStep from "../../components/CreateBounty/InitializeStep";
import PublishStep from "../../components/CreateBounty/PublishStep";
import ProcessingStep from "../../components/CreateBounty/ProcessingStep";
import VerifyStep from "../../components/CreateBounty/VerifyStep";
import CheckOutStep from "../../components/CreateBounty/CheckOutStep";
import { useAccount, useContract, useContractWrite } from "wagmi";
import { useEffect, useState } from "react";
import { useContractEvent } from "wagmi";
import { Contract, utils } from "ethers";
import BountyFactory from "../../BountyFactory.json";
import Bounty from "../../Bounty.json";
import { useSigner, useProvider } from "wagmi";
import { useRouter } from "next/router";
import { Task } from "../../typings";

const stepTitles = [
  "Initialize",
  "Publish",
  "Processing",
  "Verify",
  "Check Out",
];

const CreateBounty: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = React.useState(false);
  const [access, setAccess] = React.useState(false);
  const [createBountyStep, setCreateBountyStep] = React.useState(0);
  const signer = useSigner();
  const provider = useProvider();
  const taskRouter = useRouter();
  const [task, setTask] = React.useState<Task>({
    address: taskRouter.query.slug as string,
  } as Task);

  const goToNextStep = () => {
    setCreateBountyStep((currentStep) => {
      if (currentStep === stepTitles.length - 1) {
        return currentStep;
      }
      return currentStep + 1;
    });
  };

  const goToPreviousStep = () => {
    setCreateBountyStep((currentStep) => {
      if (currentStep === 0) {
        return currentStep;
      }
      return currentStep - 1;
    });
  };

  const stepComponents = [
    <InitializeStep />,
    <PublishStep
      task={task}
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
    />,
    <ProcessingStep
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
    />,
    <VerifyStep
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
    />,
    <CheckOutStep
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
    />,
  ];

  const currentStep = stepComponents[createBountyStep];

  const bounty = useContract({
    address: task.address,
    abi: Bounty.abi,
    signerOrProvider: provider || signer,
  });

  useContractEvent({
    address: task.address,
    abi: Bounty.abi,
    eventName: "BountySubmitted",
    listener() {
      setCreateBountyStep(3);
    },
  });

  useContractEvent({
    address: task.address,
    abi: Bounty.abi,
    eventName: "BountyReleased",
    listener() {
      setCreateBountyStep(4);
    },
  });

  useContractEvent({
    address: task.address,
    abi: Bounty.abi,
    eventName: "BountyClaimed",
    listener() {
      console.log("BountyClaimed");
    },
  });

  useEffect(() => {
    setConnected(isConnected);

    const loadTask = async () => {
      const eventSubmitted = utils.id(`BountySubmitted()`);
      const eventReleased = utils.id(`BountyReleased()`);
      const eventClaimed = utils.id(`BountyClaimed()`);

      const eventFilter = {
        address: task.address,
        abi: Bounty.abi,
        // owner: signer,
        topics: [eventSubmitted, eventReleased, eventClaimed],
        fromBlock: 0,
      };
      const logs = await provider.getLogs(eventFilter);
      //   const events = await logs.map((log) => {
      //     const event = bounty?.interface.parseLog(log);
      //     return {
      //       address: event?.args[0] as string,
      //     } as Task;
      //   });
      console.log(logs);

      // tx 1
      task.name = await bounty?.name();
      task.description = await bounty?.description();
      task.dataCID = await bounty?.dataCID();
      // tx 2
      task.bountyHunter = await bounty?.bountyHunter();
      task.zkeyCID = await bounty?.zkeyCID();
      task.circomCID = await bounty?.circomCID();
      task.verifier = await bounty?.verifier();
      //   task.a = await bounty?.a();
      //   task.b = await bounty?.b();
      //   task.c = await bounty?.c();
      //   task.hashedInput = await bounty?.hashedInput();
      // tx 3
      //   task.isCompleted = await bounty?.isCompleted();
      // tx 4
      //   task.input = await bounty?.input();

      setTask(task as Task);
      console.log("address:");
      console.log(task);
    };

    loadTask();
    console.log("task:");
    console.log(task);
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
            currentStep
          ) : (
            <h1>🚨Please connect your wallet to continue!</h1>
          )}
        </div>

        {/* for dev only */}
        <Button onClick={goToNextStep}>Next</Button>
        <Button onClick={goToPreviousStep}>Previous</Button>
      </MainFlow>
    </div>
  );
};

export default CreateBounty;
