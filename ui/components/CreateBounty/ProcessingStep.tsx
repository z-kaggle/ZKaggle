import React from "react";
import { css } from "@emotion/react";
import {
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";

import PaidIcon from "@mui/icons-material/Paid";

type ProcessingStepProps = {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
};

const ProcessingStep = ({ goToNextStep, goToPreviousStep }: ProcessingStepProps) => {
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
    </div>
  );
};

export default ProcessingStep;
