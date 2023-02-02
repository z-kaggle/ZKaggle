import { css } from "@emotion/react";
import lighthouse from "@lighthouse-web3/sdk";
import { Check } from "@mui/icons-material";
import FolderIcon from "@mui/icons-material/Folder";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { useContract } from "wagmi";

import Bounty from "../../Bounty.json";
import BountyFactory from "../../BountyFactory.json";
import { Task } from "../../typings";
import { formatBytes } from "../../utils";

type ProcessingStepProps = {
  task: Task;
};

const ProcessingStep = ({ task }: ProcessingStepProps) => {
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
  // TODO: should rename files to verifierCID [Cathie]
  const [files, setFiles] = React.useState<lighthouse.IpfsFileResponse | null>({
    Name: "circomCID.txt",
    Size: 88000,
    Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w",
  });
  // !: missing field for verifier addresss [Cathie]

  const taskRouter = useRouter();

  const { data: signer } = useSigner();

  const bounty = useContract({
    address: task.address,
    abi: Bounty.abi,
    signerOrProvider: signer,
  });

  const bountyFactory = useContract({
    address: BountyFactory.address,
    abi: BountyFactory.abi,
    signerOrProvider: signer,
  });

  const progressCallback = (progressData: any) => {
    const percentageDone =
      100 - ((progressData?.total / progressData?.uploaded) as any)?.toFixed(2);
    console.log(percentageDone);
  };

  // ?: the two functions seem to be the same, maybe we can merge them [Cathie]
  const encryptionSignature = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };

  const signAuthMessage = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const publicKey = (await signer.getAddress()).toLowerCase();
    const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return { publicKey: publicKey, signedMessage: signedMessage };
  };

  const handleUpload = async (e: string) => {
    const sig = await encryptionSignature();
    const output = await lighthouse.uploadEncrypted(
      e,
      sig.publicKey,
      process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
      sig.signedMessage,
      progressCallback
    );

    console.log(
      "Visit at https://files.lighthouse.storage/viewFile/" + output.data.Hash
    );

    const { publicKey, signedMessage } = await signAuthMessage();
    const publicKeyUserB = [await bounty!.owner()];
    console.log("Sharing file with contract owner: " + publicKeyUserB);

    const res = await lighthouse.shareFile(
      publicKey,
      publicKeyUserB,
      output.data.Hash,
      signedMessage
    );

    console.log(res);
    // !: please instruct how to split one handling function into three different states [Cathie]
    // setFiles(output.data);
  };

  const handleUploadResult = async () => {
    // TODO: will update contract to record verifierCID [Cathie]
    const submitBounty = await bounty!.submitBounty(
      Buffer.from(zkeyCID!.Hash),
      Buffer.from(circomCID!.Hash),
      // Buffer.from(files!.Hash),
      "0xc711BaB4132EbDB5705beB50BCE62DdA48Cb7981",
      [
        "14172240044072774793844585011288753813118894742160860643730950726212424123780",
        "11912368533860691264480209638201808334931774619536068060919407784292566921480",
      ],
      [
        [
          "11411885995891681770933762130690794053958102525507494895118843861091413717287",
          "7514027573924792970367948792849771893519377166975206263298024904704725939985",
        ],
        [
          "5949228699588289784664917744103034867580028000018518102143426265478680408244",
          "17579777658583367220167198373765417117912874207070998193384018557556893485922",
        ],
      ],
      [
        "3958312370074787282691478032108295537241594154559458688467820175581595625926",
        "11807315541273777388714640803711076075133845622319539789595138441286554957180",
      ],
      [
        "18383848545176925895656022227321129305",
        "20470626237853968335761818307704869799",
        "293522823212032739177258903802228976166",
        "176451233477851303752071885142877827145",
      ]
    );
    console.log("Mining...", submitBounty.hash);
    await submitBounty.wait();
    // !: taskRouter doesn't seem to be working [Cathie]
    // not sure what this is supposed to do [Cathie]
    console.log("Mined --", await bountyFactory?.bounties(0));
    taskRouter.push(`/tasks/${await bountyFactory?.bounties(0)}`);
  };

  // check whether is the owner or the rest
  useEffect(() => {
    if (address === task.bountyOwner) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [address]);

  // !: 0.5 ETH should read from contract balance instead [Cathie]
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
