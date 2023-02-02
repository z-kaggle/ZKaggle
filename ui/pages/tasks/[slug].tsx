import { css } from "@emotion/react";
import { Button, Step, StepLabel, Stepper } from "@mui/material";
import { Contract, ethers, utils } from "ethers";
import type { GetServerSidePropsContext } from "next";
import React from "react";
import { useContractEvent } from "wagmi";

import Bounty from "../../Bounty.json";
import CheckOutStep from "../../components/CreateBounty/CheckOutStep";
import InitializeStep from "../../components/CreateBounty/InitializeStep";
import ProcessingStep from "../../components/CreateBounty/ProcessingStep";
import VerifyStep from "../../components/CreateBounty/VerifyStep";
import MainFlow from "../../components/MainFlow";
import NavBar from "../../components/NavBar";
import TopBar from "../../components/TopBar";
import { Task } from "../../typings";

const stepTitles = ["Initialize", "Processing", "Verify", "Check Out"];

interface Props {
  task: Task;
}

const TaskSteps = ({ task }: Props) => {
  console.log("TaskSteps", task);

  const [bountyStep, setbountyStep] = React.useState(task.step);

  // step jumpers
  const goToNextStep = () => {
    setbountyStep((currentStep) => {
      if (currentStep === stepTitles.length - 1) {
        return currentStep;
      }
      return currentStep + 1;
    });
  };
  const goToPreviousStep = () => {
    setbountyStep((currentStep) => {
      if (currentStep === 0) {
        return currentStep;
      }
      return currentStep - 1;
    });
  };

  const stepComponents = [
    <InitializeStep key={0} />,
    <ProcessingStep key={1} task={task} />,
    <VerifyStep key={2} task={task} />,
    <CheckOutStep key={3} task={task} />,
  ];

  const currentStep = stepComponents[bountyStep];

  // listening to contract events to update step
  useContractEvent({
    address: task.address,
    abi: Bounty.abi,
    eventName: "BountySubmitted",
    listener() {
      setbountyStep(2);
    },
  });
  useContractEvent({
    address: task.address,
    abi: Bounty.abi,
    eventName: "BountyReleased",
    listener() {
      setbountyStep(3);
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
          <Stepper activeStep={bountyStep} alternativeLabel>
            {stepTitles.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {currentStep}
          {/* for dev only */}
          <Button onClick={goToNextStep}>Next</Button>
          <Button onClick={goToPreviousStep}>Previous</Button>
        </div>
      </MainFlow>
    </div>
  );
};

export default TaskSteps;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // geting task address from url
  const task: Task = {
    address: context.query.slug as string as string,
  } as Task;

  const provider = new ethers.providers.JsonRpcProvider(
    "https://api.hyperspace.node.glif.io/rpc/v1"
  );
  const bounty = new Contract(task.address, Bounty.abi, provider);

  // fetching all task address by browsing events
  const eventSubmitted = utils.id(`BountySubmitted()`);
  const eventReleased = utils.id(`BountyReleased()`);
  const eventClaimed = utils.id(`BountyClaimed()`);
  const eventFilter = {
    address: task.address,
    abi: Bounty.abi,
    topics: [eventSubmitted, eventReleased, eventClaimed],
    fromBlock: 0,
  };
  const logs = await provider.getLogs(eventFilter);
  const events = await logs.map((log) => {
    const event = bounty?.interface.parseLog(log);
    return event.name;
  });

  console.log("Events", events);

  // setting task step according to events
  if (events.includes("BountyClaimed")) {
    task.step = 3;
  } else if (events.includes("BountyReleased")) {
    task.step = 3;
  } else if (events.includes("BountySubmitted")) {
    task.step = 2;
  } else {
    task.step = 1;
  }

  // fetching all task details
  task.bountyAmount = ethers.utils.formatEther(
    await provider.getBalance(task?.address)
  );
  task.bountyOwner = await bounty?.owner();

  // tx 1
  task.name = await bounty?.name();
  task.description = await bounty?.description();
  task.dataCID = await bounty?.dataCID();
  // tx 2
  task.bountyHunter = await bounty?.bountyHunter();
  task.zkeyCID = await bounty?.zkeyCID();
  task.circomCID = await bounty?.circomCID();
  task.verifier = await bounty?.verifier();
  // task.a = await bounty?.a([0]) as string;
  // console.log("task.a", await bounty?.a([Number] as any));
  // task.b = await bounty?.b([]);
  // task.c = await bounty?.c([]);
  // task.hashedInput = await bounty?.hashedInput([]);
  // // tx 3
  // task.isCompleted = await bounty?.isCompleted();
  // // tx 4
  // task.input = await bounty?.input([]);
  console.log("task", await bounty?.a([0]));

  return {
    props: { task },
  };
};
