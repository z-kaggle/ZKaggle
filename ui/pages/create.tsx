import { css } from "@emotion/react";
import { Step, StepLabel, Stepper } from "@mui/material";
import type { NextPage } from "next";
import React from "react";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import InitializeStep from "../components/CreateBounty/InitializeStep";
import MainFlow from "../components/MainFlow";
import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";

const stepTitles = ["Initialize", "Processing", "Verify", "Check Out"];

const CreateBounty: NextPage = () => {
  const { isConnected } = useAccount();
  const [connected, setConnected] = React.useState(false);

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

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
            {stepTitles.map((label) => (
              <Step
                key={label}
                sx={{
                  // "& .MuiStepLabel-label": {
                  //   color: "black",
                  // },
                  // "& .MuiStepLabel-active": {
                  //   color: "black",
                  // },
                  // "& .MuiStepLabel-completed": {
                  //   color: "black",
                  // },
                  // "& .MuiStepIcon-root": {
                  //   color: "white",
                  // },
                  "& .MuiStepIcon-completed": {
                    color: "green",
                  },
                  "& .MuiStepIcon-active": {
                    color: "red",
                  },
                }}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {connected ? (
            <InitializeStep />
          ) : (
            <h1>🚨Please connect your wallet to continue!</h1>
          )}
        </div>
      </MainFlow>
    </div>
  );
};

export default CreateBounty;
