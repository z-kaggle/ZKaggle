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
import { useAccount, useContractRead, useSigner } from "wagmi";
import { useContract, useContractWrite, usePrepareContractWrite } from "wagmi";
import FolderIcon from "@mui/icons-material/Folder";
import lighthouse from "@lighthouse-web3/sdk";
import { formatBytes } from "../../utils";
import { Check } from "@mui/icons-material";
import { Task } from "../../typings";
import Bounty from "../../Bounty.json";
import { ethers, utils } from "ethers";

type ProcessingStepProps = {
  task: Task;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
};

const ProcessingStep = ({
  task,
  goToNextStep,
  goToPreviousStep,
}: ProcessingStepProps) => {
  const [isOwner, setIsOwner] = React.useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();
  const [zkeyCID, setZkeyCID] =
    React.useState<lighthouse.IpfsFileResponse | null>({
      Name: "zkeyCID.txt",
      Size: 88000,
      Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w",
    });
  const [circomCID, setCircomCID] =
    React.useState<lighthouse.IpfsFileResponse | null>({
      Name: "circomCID.txt",
      Size: 88000,
      Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w",
    });
  const [files, setFiles] = React.useState<lighthouse.IpfsFileResponse | null>({
    Name: "circomCID.txt",
    Size: 88000,
    Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w",
  });

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
    // setFiles(output.data);
  };

  const { data: signer } = useSigner();

  const bounty = useContract({
    address: task.address,
    abi: Bounty.abi,
    signerOrProvider: signer,
  });

  const handleUploadResult = async () => {
    // let createBounty = await bounty!.submitBounty(
    //   projectName,
    //   requirements,
    //   utils.hexlify(Buffer.from(files!.Hash, "utf8"))
    //   // {
    //   //   value: ethers.utils.parseEther("0.01"),
    //   // }
    // );
    // console.log("Mining...", createBounty.hash);
    // await createBounty.wait();
    // console.log("Mined --", await bountyFactory?.bounties(0));
    // taskRouter.push(`/tasks/${await bountyFactory?.bounties(0)}`);
  };

  // check whether is the owner or the rest
  useEffect(() => {
    if (address === task.bountyOwner) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [address]);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        max-width: 70%;
        min-width: 300px;
      `}
    >
      {isOwner ? (
        <div>
          <h1>This task is waiting for bounty hunter to pick up!</h1>
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
                <h2 style={{ padding: "0", margin: "0" }}>{task?.name}</h2>
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
              <h5>{task?.description}</h5>
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
                <h2 style={{ padding: "0", margin: "0" }}>{task?.name}</h2>
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
      <Button onClick={() => setIsOwner(!isOwner)}>Change role</Button>
    </div>
  );
};

export default ProcessingStep;
