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
import { useContract, useSigner } from "wagmi";
import { formatBytes } from "../../utils";
import BountyFactory from "../../BountyFactory.json";
import { ethers, utils } from "ethers";
import { useRouter } from "next/router";
import base32 from "base32.js";

const InitializeStep = () => {
  const [projectName, setProjectName] = React.useState("Project101");
  const [requirements, setRequirements] = React.useState("Try your best");
  // TODO: show empty state instead of dummy data [Cathie]
  const [files, setFiles] = React.useState<lighthouse.IpfsFileResponse | null>({
    Name: "example.txt",
    Size: 88000,
    Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w",
  });
  const taskRouter = useRouter();

  // file upload through lighthouse sdk

  // const handleDelete = () => {
  //   console.log("delete");
  // };

  const progressCallback = (progressData: any) => {
    let percentageDone =
      100 - ((progressData?.total / progressData?.uploaded) as any)?.toFixed(2);
    console.log(percentageDone);
  };

  // ?: should we have a "confirm" button to upload the file? [Cathie]
  const handleUpload = async (e: string) => {
    const output = await lighthouse.uploadFileRaw(
      e,
      process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
      progressCallback
    );
    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );
    setFiles(output.data);
  };

  const { data: signer } = useSigner();

  const bountyFactory = useContract({
    address: BountyFactory.address,
    abi: BountyFactory.abi,
    signerOrProvider: signer,
  });

  const handleSubmit = async () => {
    const decoder = new base32.Decoder();
    const cid = decoder.write(files!.Hash.slice(1)).finalize();
    const createBounty = await bountyFactory!.createBounty(
      projectName,
      requirements,
      cid,
      {
        value: ethers.utils.parseEther("0.01"), // TODO: this value should be set by the user [Cathie]
      }
    );
    console.log("Mining...", createBounty.hash);
    await createBounty.wait();
    // TODO: should be loading latest event instead of index 0 [Cathie]
    // !: taskRouter doesn't seem to be working [Cathie]
    // not sure what this is supposed to do [Cathie]
    console.log("Mined --", await bountyFactory?.bounties(0));
    taskRouter.push(`/tasks/${await bountyFactory?.bounties(0)}`);
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
