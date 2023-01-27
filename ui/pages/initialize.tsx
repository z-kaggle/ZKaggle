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
import TopBar from "./components/TopBar";
import NavBar from "./components/NavBar";

import PaidIcon from "@mui/icons-material/Paid";
import React from "react";

const steps = ["Initialize", "Publish", "Processing", "Verify", "Check Out"];

const InitializePage: NextPage = () => {
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
        width: 100%;
      `}
    >
      <TopBar />
      <NavBar />
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
              max-width: 50%;
              min-width: 300px;
            `}
          >
            <h1>Create your first tasks!</h1>
            <h5>Upload your file along with the requirements to filecoin </h5>
            <h2>Basic Information </h2>
            <TextField
              required
              id="standard-required"
              label="Task Name"
              defaultValue="Project101"
              variant="standard"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <TextField
              required
              id="standard-required"
              label="Requirements"
              defaultValue="Try your best"
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
                <ListItemText primary="File.zip" />
              </ListItemButton>
              <ListItemButton
              // selected={selectedIndex === 3}
              // onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemText primary="File1.zip" />
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
              Upload
              <input hidden accept="image/*" multiple type="file" />
            </Button>

            <h2>Deposit Bounty </h2>
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
                height: "50px",
                width: "100px",
                alignSelf: "flex-end",
              }}
              onClick={() => handleSubmit()}
            >
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitializePage;
