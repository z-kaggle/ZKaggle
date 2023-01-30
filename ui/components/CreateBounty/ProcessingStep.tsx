import React, { useEffect } from "react";
import { css } from "@emotion/react";
import {
  ListItemButton,
  Divider,
  Stack,
  TextField,
  List,
  ListItemText,
  Button,
  ListItemIcon,
  ListItem,
} from "@mui/material";
import { useContractRead } from "wagmi";
import { useContract, useContractWrite, usePrepareContractWrite } from "wagmi";
import FolderIcon from "@mui/icons-material/Folder";
import lighthouse from "@lighthouse-web3/sdk";
import { formatBytes } from "../../utils";
import { Check } from "@mui/icons-material";

type ProcessingStepProps = {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
};

const ProcessingStep = ({
  goToNextStep,
  goToPreviousStep,
}: ProcessingStepProps) => {
  const [isBountyHunter, setIsBountyHunter] = React.useState(false);
  const [files, setFiles] = React.useState<lighthouse.IpfsFileResponse | null>({
    Name: "example.txt",
    Size: 88000,
    Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w",
  });

  // file upload through lighthouse sdk

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
    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );
    setFiles(output.data);
  };

  const handleUploadResult = async () => {};

  // useEffect(() => {
  //   const { data, isError, isLoading } = useContractRead({
  //     address: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
  //     abi: wagmigotchiABI,
  //     functionName: "getTask",
  //   });
  // }, []);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        max-width: 70%;
        min-width: 300px;
      `}
    >
      {isBountyHunter ? (
        <div>
          <h1>This task is being handling by a bounty hunter!</h1>
          <h5>It will take up to 2-3 days.</h5>

          <div
            css={css`
              display: flex;
              flex-direction: column;
              max-width: 35vw;
              min-width: 300px;
            `}
          >
            <Stack paddingTop={6} spacing={0}>
              <Stack
                direction="row"
                spacing={10}
                justifyContent="space-between"
              >
                <h2 style={{ padding: "0", margin: "0" }}>
                  MNIST Training Task
                </h2>
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

            <h2>Files</h2>
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
          </div>
        </div>
      ) : (
        <div>
          <h1>Upload your results ASAP</h1>
          <h5>It will take up to 2-3 days.</h5>

          <div
            css={css`
              display: flex;
              flex-direction: column;
              max-width: 35vw;
              min-width: 300px;
            `}
          >
            <Stack paddingTop={6} spacing={0}>
              <Stack
                direction="row"
                spacing={10}
                justifyContent="space-between"
              >
                <h2 style={{ padding: "0", margin: "0" }}>
                  MNIST Training Task
                </h2>
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
              <input
                hidden
                multiple
                type="file"
                onChange={handleUpload as any}
              />
            </Button>

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
              <input
                hidden
                multiple
                type="file"
                onChange={handleUpload as any}
              />
            </Button>

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
              <input
                hidden
                multiple
                type="file"
                onChange={handleUpload as any}
              />
            </Button>
            <Divider
              css={css`
                margin-top: 40px;
                margin-bottom: 20px;
              `}
            />
            <Button
              variant="contained"
              startIcon={<Check />}
              sx={{
                borderRadius: "30px",
                height: "50px",
                alignSelf: "flex-end",
              }}
              onClick={handleUploadResult}
            >
              Confirm Upload Result
            </Button>
          </div>
        </div>
      )}

      {/* for development purpose */}
      <Button onClick={() => setIsBountyHunter(!isBountyHunter)}>
        Change role
      </Button>
    </div>
  );
};

export default ProcessingStep;
