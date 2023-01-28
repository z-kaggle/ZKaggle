import React from "react";
import { css } from "@emotion/react";
import { Stepper, Step, StepLabel } from "@mui/material";
import type { NextPage } from "next";
import TopBar from "../components/TopBar";
import NavBar from "../components/NavBar";

import MainFlow from "../components/MainFlow";
import InitializeStep from "../components/CreateBounty/InitializeStep";
import PublishStep from "../components/CreateBounty/PublishStep";
import ProcessingStep from "../components/CreateBounty/ProcessingStep";
import VerifyStep from "../components/CreateBounty/VerifyStep";
import CheckOutStep from "../components/CreateBounty/CheckOutStep";

const stepTitles = [
  "Initialize",
  "Publish",
  "Processing",
  "Verify",
  "Check Out",
];

const CreateBounty: NextPage = () => {
  const [createBountyStep, setCreateBountyStep] = React.useState(0);

  const goToNextStep = () => {
    setCreateBountyStep((currentStep) => {
      if (currentStep === stepTitles.length - 1) {
        return currentStep;
      }
      return currentStep + 1;
    });
  };

  const goToPreviousStep = () => {
    setCreateBountyStep((currentStep) => {
      if (currentStep === 0) {
        return currentStep;
      }
      return currentStep - 1;
    });
  };

  const stepComponents = [
    <InitializeStep
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
    />,
    <PublishStep
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
    />,
    <ProcessingStep
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
    />,
    <VerifyStep
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
    />,
    <CheckOutStep
      goToNextStep={goToNextStep}
      goToPreviousStep={goToPreviousStep}
    />,
  ];

  const currentStep = stepComponents[createBountyStep];

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
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentStep}
        </div>
      </MainFlow>
    </div>
  );
};

export default CreateBounty;
