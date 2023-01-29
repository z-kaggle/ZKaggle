import React from "react";
import { css } from "@emotion/react";
import {
  TextField,
  List,
  ListItemText,
  Button,
  ListItemIcon,
  ListItem,
} from "@mui/material";

import PaidIcon from "@mui/icons-material/Paid";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FolderIcon from "@mui/icons-material/Folder";
import lighthouse from "@lighthouse-web3/sdk";

type InitializeStepProps = {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
};

interface FileData {
  name: string;
  size: number;
  requirements: string;
  hash: string;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const InitializeStep = ({
  goToNextStep,
  goToPreviousStep,
}: InitializeStepProps) => {
  const [projectName, setProjectName] = React.useState("Project101");
  const [requirements, setRequirements] = React.useState("Try your best");
  const [files, setFiles] = React.useState<lighthouse.IpfsFileResponse | null>({
    Name: "example.txt",
    Size: 88000,
    Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w",
  });

  // const handleDelete = () => {
  //   console.log("delete");
  // };

  const progressCallback = (progressData: any) => {
    let percentageDone =
      100 - ((progressData?.total / progressData?.uploaded) as any)?.toFixed(2);
    console.log(percentageDone);
  };

  const handleUpload = async (e: string) => {
    const output = await lighthouse.upload(
      e,
      process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
      progressCallback
    );
    console.log("File Status:", output);
    /*
      output:
        {
          Name: "filename.txt",
          Size: 88000,
          Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
        }
      Note: Hash in response is CID.
    */

    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );

    setFiles(output.data);
  };

  const handleSubmit = () => {
    // contract creation with deposit money
    console.log("submit");
    goToNextStep();
  };

  return (
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
        id="outlined-required"
        label="Task Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        sx={{
          marginTop: "10px",
        }}
      />

      <TextField
        required
        id="outlined-multiline-static"
        label="Requirements"
        multiline
        rows={4}
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
        sx={{
          marginTop: "40px",
        }}
      />
      <h2>File Upload </h2>

      <List dense={true}>
        <ListItem key={files?.Hash}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText
            primary={files?.Name}
            secondary={formatBytes(files?.Size as number)}
            primaryTypographyProps={{
              style: {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
          {/* <IconButton onClick={() => handleDelete()}>
              <HighlightOffIcon />
            </IconButton> */}
        </ListItem>
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
        <input hidden multiple type="file" onChange={handleUpload as any} />
      </Button>

      <h2>Deposit Bounty </h2>

      <Button
        variant="contained"
        startIcon={<PaidIcon />}
        sx={{
          borderRadius: "30px",
          height: "50px",
          alignSelf: "flex-end",
        }}
        onClick={() => handleSubmit()}
      >
        Deposit Bounty to Create Task
      </Button>
    </div>
  );
};

export default InitializeStep;
