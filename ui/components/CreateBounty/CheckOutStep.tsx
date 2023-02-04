import { css } from "@emotion/react";
import PaidIcon from "@mui/icons-material/Paid";
import { Button, Chip, Divider, Input, Stack, useTheme } from "@mui/material";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React from "react";
import { useAccount, useContract, useSigner } from "wagmi";

import Bounty from "../../Bounty.json";
import { Task } from "../../typings";

type CheckOutStepProps = {
  task: Task;
};

const CheckOutStep = ({ task }: CheckOutStepProps) => {
  const taskRouter = useRouter();

  const { address: address } = useAccount();
  const [isBountyHunter, setIsBountyHunter] = React.useState(
    address === task.bountyHunter
  );
  const [isBountyOwner, setIsBountyOwner] = React.useState(
    address === task.bountyOwner
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const { data: signer } = useSigner();

  const bounty = useContract({
    address: task.address,
    abi: Bounty.abi,
    signerOrProvider: signer,
  });

  const handleClaim = async () => {
    const preImage = inputRef.current?.value;
    if (!preImage) {
      alert("Please enter pre-image(s) of hashed results");
      return;
    }
    let calldata;
    try {
      calldata = JSON.parse(preImage);
      if (!Array.isArray(calldata)) {
        alert("Please enter in array format");
        return;
      }
      console.log(calldata);
    } catch (e) {
      alert("Please enter in array format");
      return;
    }

    const claimBounty = await bounty!.claimBounty(calldata);

    console.log("Mining...", claimBounty.hash);
    // await claimBounty.wait(); // !: .wait might not resolve [Cathie]

    // // !: hacky way to use while loop instead [Cathie]
    // const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    // let receipt = null;
    // while (receipt === null) {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   try {
    //     receipt = await provider.getTransactionReceipt(claimBounty.hash);
    //   } catch (error) {
    //     console.log(error);
    //     break;
    //   }
    //   console.log("not yet");
    // }

    // console.log("Mined --", claimBounty.hash);
    // taskRouter.replace("/submissions");
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
          <h1>Congrats!</h1>
          <h5>
            Your task has been verified by the provider. You can claim the
            bounty now.
          </h5>
        </>
      ) : isBountyOwner ? (
        <>
          <h1>Results are in!</h1>
          <h5>Check the computed results below.</h5>
        </>
      ) : (
        <h1 style={{marginBottom:"20px"}}>This is not your task.</h1>
      )}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          max-width: 35vw;
          min-width: 300px;
        `}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="nowrap"
          overflow="overlay"
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
        {isBountyHunter ? (
          <>
            <h2>Unhash computed results</h2>

            <Input
              color="secondary"
              inputRef={inputRef}
              placeholder="enter pre-image(s) of hashed results, e.g. [5, 123456789]"
              style={{ margin: "0 0 30px 0" }}
            />
            <Divider
              css={css`
                margin-top: 40px;
                margin-bottom: 20px;
              `}
            />
            <Button
              variant="contained"
              startIcon={<PaidIcon />}
              component="label"
              sx={{
                borderRadius: "30px",
                height: "50px",
                alignSelf: "flex-end",
              }}
              onClick={() => handleClaim()}
            >
              Claim
            </Button>
          </>
        ) : isBountyOwner ? (
          <>
            <h2>Computed results</h2>
            <h5>{task.input0}</h5>
            <h5>{task.input1}</h5>

            <h2>Hashed results</h2>
            <h5>{task.hashedInput}</h5>
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

export default CheckOutStep;
