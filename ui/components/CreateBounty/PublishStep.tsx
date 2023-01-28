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

type PublishStepProps = {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
};

const PublishStep = ({ goToNextStep, goToPreviousStep }: PublishStepProps) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        max-width: 50%;
        min-width: 300px;
      `}
    >
      <h1>Your task is waiting for picking up!</h1>
      <h5>Your task will be shown in the task pool.</h5>

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
      </div>
    </div>
  );
};

export default PublishStep;
