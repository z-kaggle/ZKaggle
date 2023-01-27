import { NextComponentType } from "next";
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

import SendIcon from "@mui/icons-material/Send";
import React from "react";

const steps = ["Step1", "Step2", "Step3", "Step4", "Step5"];

const TaskForm: NextComponentType = () => {
  const [projectName, setProjectName] = React.useState("");
  const [requirements, setRequirements] = React.useState("");

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
        width: 80%;
        margin-left: 20%;
        margin-top: 60px;
      `}
    >
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
            width: 50%;
          `}
        >
          <h1>Create your first tasks!</h1>
          <h5>Upload your file along with the requirements to filecoin </h5>
          <h2>Basic Information </h2>
          <TextField
            required
            id="standard-required"
            label="Required"
            defaultValue="Hello World"
            variant="standard"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <TextField
            required
            id="standard-required"
            label="Required"
            defaultValue="Hello World"
            variant="standard"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
          <h2>File Upload </h2>
          <List component="nav" aria-label="secondary mailbox folder">
            <ListItemButton
            // selected={selectedIndex === 2}
            // onClick={(event) => handleListItemClick(event, 2)}
            >
              <ListItemText primary="Trash" />
            </ListItemButton>
            <ListItemButton
            // selected={selectedIndex === 3}
            // onClick={(event) => handleListItemClick(event, 3)}
            >
              <ListItemText primary="Spam" />
            </ListItemButton>
          </List>
          <Button variant="contained" component="label">
            Upload
            <input hidden accept="image/*" multiple type="file" />
          </Button>
          <h2>Deposit Bounty </h2>
          <Button variant="contained" endIcon={<SendIcon />}>
            Bounty
          </Button>
          <Button variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
          <Divider
            css={css`
              margin-top: 20px;
              margin-bottom: 20px;
            `}
          />
          <Button
            variant="contained"
            sx={{
              borderRadius: "30px",
            }}
            onClick={() => handleSubmit()}
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
