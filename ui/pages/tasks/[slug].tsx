import { css } from "@emotion/react";
import { Button, Step, StepLabel, Stepper } from "@mui/material";
import { Contract, ethers } from "ethers";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useContractEvent } from "wagmi";

import Bounty from "../../Bounty.json";
import dynamic from "next/dynamic";

import MainFlow from "../../components/MainFlow";
import NavBar from "../../components/NavBar";
import TopBar from "../../components/TopBar";
import { Task } from "../../typings";

const stepTitles = ["Initialize", "Processing", "Verify", "Check Out"];

interface Props {
  task: Task;
}

const TaskSteps = ({ task }: Props) => {
  const CheckOutStep = dynamic(() => import("../../components/CreateBounty/CheckOutStep"), { ssr: false });
  const ProcessingStep = dynamic(() => import("../../components/CreateBounty/ProcessingStep"), { ssr: false });
  const VerifyStep = dynamic(() => import("../../components/CreateBounty/VerifyStep"), { ssr: false });
  
  console.log("TaskSteps", task);

  const taskRouter = useRouter();

  const [bountyStep, setbountyStep] = React.useState(Math.min(3, Math.max(1, task.completedStep)));

  // step jumpers
  // const goToNextStep = () => {
  //   setbountyStep((currentStep) => {
  //     if (currentStep === stepTitles.length - 1) {
  //       return currentStep;
  //     }
  //     return currentStep + 1;
  //   });
  // };
  // const goToPreviousStep = () => {
  //   setbountyStep((currentStep) => {
  //     if (currentStep === 0) {
  //       return currentStep;
  //     }
  //     return currentStep - 1;
  //   });
  // };

  // listening to contract events to update step
  useContractEvent({
    address: task.address,
    abi: Bounty.abi,
    eventName: "BountySubmitted",
    async listener() {
      console.log("BountySubmitted");
      await taskRouter.replace(taskRouter.asPath);
      setbountyStep(2);
    },
  });
  useContractEvent({
    address: task.address,
    abi: Bounty.abi,
    eventName: "BountyReleased",
    async listener() {
      console.log("BountyReleased");
      await taskRouter.replace(taskRouter.asPath);
      setbountyStep(3);
    },
  });
  useContractEvent({
    address: task.address,
    abi: Bounty.abi,
    eventName: "BountyClaimed",
    listener() {
      console.log("BountyClaimed");
      taskRouter.replace(taskRouter.asPath);
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
          <Stepper activeStep={bountyStep} alternativeLabel color="primary">
            {stepTitles.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {bountyStep === 1 ? <ProcessingStep task={task} /> : null}
          {bountyStep === 2 ? <VerifyStep task={task} /> : null}
          {bountyStep === 3 ? <CheckOutStep task={task} /> : null}
          {/* for dev only */}
          {/* <Button color="secondary" onClick={goToNextStep}>
            Next
          </Button>
          <Button color="secondary" onClick={goToPreviousStep}>
            Previous
          </Button> */}
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
    address: context.query.slug as string,
  } as Task;

  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );
  const bounty = new Contract(task.address, Bounty.abi, provider);

  task.bountyAmount = ethers.utils.formatEther(
    await provider.getBalance(task?.address)
  );
  // console.log(task.bountyAmount);
  task.bountyOwner = await bounty?.owner();
  // console.log(task.bountyOwner);

  task.completedStep = Math.min(await bounty?.completedStep(), 3);
  // console.log(task.completedStep);

  // fetching all task details
  // tx 1
  task.name = await bounty?.name();
  // console.log(task.name);
  task.description = await bounty?.description();
  // console.log(task.description);
  task.dataCID = await bounty?.dataCID();
  // console.log(task.dataCID);

  // tx 2
  task.bountyHunter = await bounty?.bountyHunter();
  // console.log(task.bountyHunter);
  task.zkeyCID = await bounty?.zkeyCID();
  // console.log(task.zkeyCID);
  task.circomCID = await bounty?.circomCID();
  // console.log(task.circomCID);
  task.verifierCID = await bounty?.verifierCID();
  // console.log(task.verifierCID);
  task.verifier = await bounty?.verifier();
  // console.log(task.verifier);
  // task.a = [await bounty?.a(0), await bounty?.a(1)];
  // task.b = [[await bounty?.b(0, 0), await bounty?.b(0, 1)], [await bounty?.b(1, 0), await bounty?.b(1, 1)]];
  // task.c = [await bounty?.c(0), await bounty?.c(1)];

  // !: hacky way to get the hashed input [Cathie]
  try {
    task.hashedInput = await bounty?.concatDigest(
      await bounty?.hashedInput(0),
      await bounty?.hashedInput(1)
    );
    // console.log(task.hashedInput);
  } catch (error) {
    console.log(error);
  }

  // tx 3
  task.isCompleted = await bounty?.isComplete();
  // console.log(task.isCompleted);

  // tx 4
  // !: hacky way to get the input [Cathie]
  try {
    task.input0 = (await bounty?.input(0))?.toString();
    // console.log(task.input0);
    task.input1 = (await bounty?.input(1))?.toString();
    // console.log(task.input1);
  } catch (error) {
    console.log(error);
  }

  return {
    props: { task },
  };
};
