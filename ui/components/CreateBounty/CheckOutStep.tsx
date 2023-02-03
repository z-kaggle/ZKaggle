import { css } from "@emotion/react";
import {
  Button,
  Stack,
  Input,
} from "@mui/material";
import React from "react";

import { Task } from "../../typings";
import { useContract, useSigner, useBalance } from "wagmi";
import Bounty from "../../Bounty.json";

type CheckOutStepProps = {
  task: Task;
};

const CheckOutStep = ({ task }: CheckOutStepProps) => {
  // TODO: switch to use task.BountyHunter [Cathie]
  const [isBountyHunter, setIsBountyHunter] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

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
    try{
      calldata = JSON.parse(preImage);
      if (!Array.isArray(calldata)) {
        alert("Please enter in array format");
        return;
      }
      console.log(calldata);
    }
    catch(e){
      alert("Please enter in array format");
      return;
    }

    const claimBounty = await bounty!.claimBounty(calldata);

    console.log("Mining...", claimBounty.hash);
    await claimBounty.wait();
    
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
          <h1>Congrats!</h1>
          <h5>
            Your task has been verified by the provider.
            You can claim the bounty now.
          </h5>
        </>
      ) : (
        <>
          <h1>Results are in!</h1>
          <h5>Check the computed results below.</h5>
        </>
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
          <Stack direction="row" spacing={10} justifyContent="space-between">
            <h2 style={{ padding: "0", margin: "0" }}>{task.name}</h2>
            <Button
              variant="outlined"
              sx={{
                width: "150px",
                alignSelf: "flex-end",
              }}
            >
              {task.bountyAmount} TFIL
            </Button>
          </Stack>
          <h5>{task.description}</h5>
        </Stack>
        {isBountyHunter ? (
          <>
            <h2>Unhash computed results</h2>

            <Input
              inputRef={inputRef}
              placeholder="enter pre-image(s) of hashed results, e.g. [5, 123456789]"
              style={{ margin: "0 0 30px 0" }}
            />
            <Button
              variant="outlined"
              component="label"
              sx={{
                width: "100px",
                alignSelf: "flex-end",
                marginBottom: "40px",
              }}
              onClick={() => handleClaim()}
            >
              Claim
            </Button>
          </>
        ) : (
          <>
          <h2>Computed results</h2>
          <h5>{task.input}</h5>

          <h2>Hashed results</h2>
          <h5>{task.hashedInput}</h5>
          </>)}
      {/* for development purpose */}
      <Button onClick={() => setIsBountyHunter(!isBountyHunter)}>
        Change role
      </Button>
    </div></div>
  );
};

export default CheckOutStep;
