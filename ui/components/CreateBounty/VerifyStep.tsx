import { css } from "@emotion/react";
import DoneIcon from "@mui/icons-material/Done";
import { Button, Chip, Divider, Stack, useTheme } from "@mui/material";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React from "react";
import { useAccount, useContract, useSigner } from "wagmi";

import Bounty from "../../Bounty.json";
import { Task } from "../../typings";

type VerifyStepProps = {
  task: Task;
};

const VerifyStep = ({ task }: VerifyStepProps) => {
  const decoder = new TextDecoder();
  const taskRouter = useRouter();
  const theme = useTheme();

  const { address: address } = useAccount();
  const [isBountyHunter, setIsBountyHunter] = React.useState(
    address === task.bountyHunter
  );
  const [isBountyOwner, setIsBountyOwner] = React.useState(
    address === task.bountyOwner
  );

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
  };

  const urlPrefix = "https://files.lighthouse.storage/viewFile/";

  const openZkeyFile = () => {
    const cid = decoder.decode(ethers.utils.arrayify(task.zkeyCID));
    window.open(urlPrefix + cid, "_blank");
  };

  const openCircomFile = () => {
    const cid = decoder.decode(ethers.utils.arrayify(task.circomCID));
    window.open(urlPrefix + cid, "_blank");
  };

  const openVerifierFile = () => {
    const cid = decoder.decode(ethers.utils.arrayify(task.verifierCID));
    window.open(urlPrefix + cid, "_blank");
  };

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
            The bounty hunter has submitted the results. <br />
            Please verify the results and pay the bounty.
          </h5>
        </>
      ) : (
        <h1 style={{ marginBottom: "20px" }}>This is not your task.</h1>
      )}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          max-width: 35vw;
          min-width: 300px;
        `}
      >
        <Stack paddingTop={6} spacing={0}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            flexWrap="nowrap"
            overflow="visible"
          >
            <h2 style={{ padding: "0", margin: "0", flexShrink: 0 }}>
              {task.name}
            </h2>
            <div style={{ flexShrink: 0 }}>
              <Chip
                label={task.isCompleted ? "Completed" : "In Progress"}
                sx={{
                  backgroundColor: task.isCompleted
                    ? ""
                    : theme.palette.primary.contrastText,
                  color: "white",
                  borderRadius: "50px",
                  marginRight: "10px",
                  fontSize: "12px",
                  height: "20px",
                }}
              />
              <Chip
                label={task.bountyAmount + " tFil"}
                {...(!task.isCompleted && {
                  variant: "outlined",
                  color: "secondary",
                })}
                sx={{
                  color: task.isCompleted
                    ? "white"
                    : theme.palette.primary.contrastText,
                  borderRadius: "50px",
                  marginRight: "10px",
                  fontSize: "12px",
                  height: "20px",
                }}
              />
            </div>
          </Stack>
          <h5>{task.description}</h5>
        </Stack>

        {isBountyOwner ? (
          <>
            <h2>Verify files</h2>
            <Button
              variant="outlined"
              color="secondary"
              component="label"
              sx={{
                width: "200px",
                alignSelf: "flex-end",
                marginBottom: "40px",
              }}
              onClick={() => openZkeyFile()}
            >
              View zkey file
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              component="label"
              sx={{
                width: "200px",
                alignSelf: "flex-end",
                marginBottom: "40px",
              }}
              onClick={() => openCircomFile()}
            >
              View circom file
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              component="label"
              sx={{
                width: "200px",
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
            <Divider
              css={css`
                margin-top: 40px;
                margin-bottom: 20px;
              `}
            />
            <Button
              variant="contained"
              startIcon={<DoneIcon />}
              component="label"
              sx={{
                borderRadius: "30px",
                height: "50px",
                alignSelf: "flex-end",
              }}
              onClick={() => handleRelease()}
            >
              Release
            </Button>
          </>
        ) : null}
        {/* for development purpose */}
        {/* <Button
          color="secondary"
          onClick={() => {
            setIsBountyHunter(true);
            setIsBountyOwner(false);
          }}
        >
          Switch to bounty hunter
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setIsBountyHunter(false);
            setIsBountyOwner(true);
          }}
        >
          Switch to bounty owner
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setIsBountyHunter(false);
            setIsBountyOwner(false);
          }}
        >
          Switch to neither
        </Button> */}
      </div>
    </div>
  );
};

export default VerifyStep;
