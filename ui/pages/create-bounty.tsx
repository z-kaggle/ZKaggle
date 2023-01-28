import React from "react";
import { css } from "@emotion/react";
import {
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import type { NextPage } from "next";
import TopBar from "../components/TopBar";
import NavBar from "../components/NavBar";

import MainFlow from "../components/MainFlow";

const steps = ["Initialize", "Publish", "Processing", "Verify", "Check Out"];

const InitializePage: NextPage = () => {
  

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

          
        </div>
      </MainFlow>
    </div>
  );
};

export default InitializePage;
