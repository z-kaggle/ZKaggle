import { css } from "@emotion/react";
import {
  Stepper,
  Step,
  StepLabel,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import type { NextPage } from "next";
import TopBar from "../components/TopBar";
import NavBar from "../components/NavBar";

import PaidIcon from "@mui/icons-material/Paid";
import React from "react";
import MainFlow from "../components/MainFlow";

const steps = ["Initialize", "Publish", "Processing", "Verify", "Check Out"];

const VerifyPage: NextPage = () => {
  const [projectName, setProjectName] = React.useState("Project101");
  const [requirements, setRequirements] = React.useState("Try your best");

  const handleUpload = () => {
    console.log("upload");
  };

  const handleDeposit = () => {
    console.log("deposit");
  };

  const handleSubmit = () => {
    console.log("submit");
  };

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
          <Stepper activeStep={0} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              max-width: 50%;
              min-width: 300px;
            `}
          ></div>
        </div>
      </MainFlow>
    </div>
  );
};

export default VerifyPage;
