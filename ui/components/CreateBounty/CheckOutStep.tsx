import React from "react";
import { css } from "@emotion/react";
import {
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
  Stack,
} from "@mui/material";

import PaidIcon from "@mui/icons-material/Paid";

type CheckOutStepProps = {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
};

const CheckOutStep = ({
  goToNextStep,
  goToPreviousStep,
}: CheckOutStepProps) => {
  const [isBountyHunter, setIsBountyHunter] = React.useState(false);
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
            Your task has been verified by the provider, your bounty has been
            released to your wallet
          </h5>
        </>
      ) : (
        <>
          <h1>Closing the task!</h1>
          <h5>Check the results and release the bounty</h5>
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
            <h2 style={{ padding: "0", margin: "0" }}>MNIST Training Task</h2>
            <Button
              variant="outlined"
              sx={{
                width: "150px",
                alignSelf: "flex-end",
              }}
            >
              0.5 ETH
            </Button>
          </Stack>
          <h5>Your task will be shown in the task pool.</h5>
        </Stack>

        <h2>Input</h2>
        <List component="nav" aria-label="secondary mailbox folder">
          <ListItemButton>
            <ListItemText primary="Input 1" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Input 2" />
          </ListItemButton>
        </List>
        <Button
          variant="outlined"
          component="label"
          sx={{
            width: "100px",
            alignSelf: "flex-end",
            marginBottom: "40px",
          }}
        >
          Download
          <input hidden accept="image/*" multiple type="file" />
        </Button>

        <Divider />

        <h2>Results</h2>
        <List component="nav" aria-label="secondary mailbox folder">
          <ListItemButton>
            <ListItemText primary="Results 1" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Results 2" />
          </ListItemButton>
        </List>
        <Button
          variant="outlined"
          component="label"
          sx={{
            width: "100px",
            alignSelf: "flex-end",
          }}
        >
          Download
          <input hidden accept="image/*" multiple type="file" />
        </Button>

        <h2>Release Bounty</h2>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
          `}
        >
          <Button
            variant="outlined"
            sx={{
              width: "150px",
              alignSelf: "flex-end",
            }}
          >
            0.5 ETH
          </Button>
          <Button
            variant="outlined"
            startIcon={<PaidIcon />}
            sx={{
              width: "150px",
              alignSelf: "flex-end",
              marginLeft: "10px",
            }}
          >
            Deposit
          </Button>
        </div>

        <Divider
          css={css`
            margin-top: 40px;
            margin-bottom: 20px;
          `}
        />
        <Button
          variant="contained"
          sx={{
            borderRadius: "30px",
            height: "40px",
            width: "100px",
            alignSelf: "flex-end",
          }}
          // onClick={() => handleSubmit()}
        >
          Finish
        </Button>
      </div>
      {/* for development purpose */}
      <Button onClick={() => setIsBountyHunter(!isBountyHunter)}>
        Change role
      </Button>
    </div>
  );
};

export default CheckOutStep;
