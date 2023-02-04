import { css } from "@emotion/react";
import {
  Button,
  Stack,
} from "@mui/material";
import React from "react";

import { Task } from "../../typings";
import { useContract, useSigner, useAccount } from "wagmi";
import Bounty from "../../Bounty.json";
import { useRouter } from "next/router";
import { ethers } from "ethers";

type VerifyStepProps = {
  task: Task;
};

const VerifyStep = ({ task }: VerifyStepProps) => {
  const decoder = new TextDecoder();
  const taskRouter = useRouter();

  const { address: address } = useAccount();
  const [isBountyHunter, setIsBountyHunter] = React.useState(address === task.bountyHunter);
  const [isBountyOwner, setIsBountyOwner] = React.useState(address === task.bountyOwner);

  const { data: signer } = useSigner();

  const bounty = useContract({
    address: task.address,
    abi: Bounty.abi,
    signerOrProvider: signer,
  });

  const handleRelease = async () => {
    const releaseBounty = await bounty!.releaseBounty();
    console.log("Mining...", releaseBounty.hash);
    // await releaseBounty.wait();
    // taskRouter.push(`/tasks/${task.address}`);
  }

  const urlPrefix = "https://files.lighthouse.storage/viewFile/"

  const openZkeyFile = () => {
    const cid = decoder.decode(ethers.utils.arrayify(task.zkeyCID));
    window.open(urlPrefix + cid, "_blank");
  }

  const openCircomFile = () => {
    const cid = decoder.decode(ethers.utils.arrayify(task.circomCID));
    window.open(urlPrefix + cid, "_blank");
  }
  
  const openVerifierFile = () => {
    const cid = decoder.decode(ethers.utils.arrayify(task.verifierCID));
    window.open(urlPrefix + cid, "_blank");
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        max-width: 50%;
        min-width: 300px;
      `}
    >
      {isBountyHunter ? (
        <>
          <h1>Awaiting verification...</h1>
          <h5>
            The bounty owner will verify your results and pay you the bounty.
            This may take a while.
          </h5>
        </>
      ) : isBountyOwner ? (
        <>
          <h1>You got a submission!</h1>
          <h5>
            The bounty hunter has submitted the results.
            Please verify the results and pay the bounty.
          </h5>
        </>
      ) :
        (<h1>This is not your task.</h1>)}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          max-width: 35vw;
          min-width: 300px;
        `}
      >
        <Stack paddingTop={6} spacing={0}>
          <Stack direction="row" spacing={10} justifyContent="space-between">
            <h2 style={{ padding: "0", margin: "0" }}>{task.name}</h2>
            <Button
              variant="outlined"
              sx={{
                width: "150px",
                alignSelf: "flex-end",
              }}
            >
              {task.bountyAmount} tFIL
            </Button>
          </Stack>
          <h5>{task.description}</h5>
        </Stack>
        {isBountyOwner ? (
          <>
            <Button
              variant="outlined"
              component="label"
              sx={{
                width: "300px",
                alignSelf: "flex-end",
                marginBottom: "40px",
              }}
              onClick={() => openZkeyFile()}
            >
              View zkey file
            </Button>
            <Button
              variant="outlined"
              component="label"
              sx={{
                width: "300px",
                alignSelf: "flex-end",
                marginBottom: "40px",
              }}
              onClick={() => openCircomFile()}
            >
              View circom file
            </Button>
            <Button
              variant="outlined"
              component="label"
              sx={{
                width: "300px",
                alignSelf: "flex-end",
                marginBottom: "40px",
              }}
              onClick={() => openVerifierFile()}
            >
              View verifier file
            </Button>
            <h2>Verifier contract address</h2>
            <h5>{task.verifier}</h5>
            {/* <Button
              variant="contained"
              component="label"
              sx={{
                width: "100px",
                alignSelf: "flex-end",
                marginBottom: "40px",
              }}
              onClick={() => { }}
            >
              Verify
            </Button> */}
            <Button
              variant="contained"
              component="label"
              sx={{
                width: "100px",
                alignSelf: "flex-end",
                marginBottom: "40px",
              }}
              onClick={() => handleRelease()}
            >
              Release
            </Button>
          </>
        ) : null}
        {/* for development purpose */}
        <Button onClick={
          () => {
            setIsBountyHunter(true);
            setIsBountyOwner(false);
          }}>
          Switch to bounty hunter
        </Button>
        <Button onClick={
          () => {
            setIsBountyHunter(false);
            setIsBountyOwner(true);
          }}>
          Switch to bounty owner
        </Button>
        <Button onClick={
          () => {
            setIsBountyHunter(false);
            setIsBountyOwner(false);
          }}>
          Switch to neither
        </Button>
      </div></div>
  );
};

export default VerifyStep;
