import React, { useEffect } from "react";
import { css } from "@emotion/react";
import {
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
  Stack,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import { formatBytes } from "../../utils";
import FolderIcon from "@mui/icons-material/Folder";
import PaidIcon from "@mui/icons-material/Paid";
import lighthouse from "@lighthouse-web3/sdk";
import { useAccount, useContractRead } from "wagmi";
import { useContract, useContractWrite, usePrepareContractWrite } from "wagmi";
import { Check } from "@mui/icons-material";

type PublishStepProps = {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
};

const PublishStep = ({ goToNextStep, goToPreviousStep }: PublishStepProps) => {
  const [isOwner, setIsOwner] = React.useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();
  const [files, setFiles] = React.useState<lighthouse.IpfsFileResponse | null>({
    Name: "example.txt",
    Size: 88000,
    Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w",
  });

  const handleTakeTask = () => {
    // setting task onchain status to next step
    goToNextStep();
  };

  useEffect(() => {
    // const { data, isError, isLoading } = useContractRead({
    //   address: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
    //   abi: wagmigotchiABI,
    //   functionName: "getTask",
    // });
    // if (data.owner === address) {
    //   setIsOwner(true);
    // } else {
    //   setIsOwner(false);
    // }
  }, []);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        max-width: 50%;
        min-width: 300px;
      `}
    >
      {isOwner ? (
        <div>
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
              <Stack
                direction="row"
                spacing={10}
                justifyContent="space-between"
              >
                <h2 style={{ padding: "0", margin: "0" }}>{bounty.name}</h2>
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
          <h1>This task is waiting for picking up!</h1>
          <h5>Take the task ASAP!</h5>

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
              onClick={() => handleTakeTask()}
            >
              Take the Task
            </Button>
          </div>
        </div>
      )}
      {/* for development purpose */}
      <Button onClick={() => setIsOwner(!isOwner)}>Change role</Button>
    </div>
  );
};

export default PublishStep;
