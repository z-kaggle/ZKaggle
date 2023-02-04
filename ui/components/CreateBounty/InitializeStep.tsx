import { css } from "@emotion/react";
import lighthouse from "@lighthouse-web3/sdk";
import FolderIcon from "@mui/icons-material/Folder";
import PaidIcon from "@mui/icons-material/Paid";
import {
  Button,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  useTheme,
} from "@mui/material";
import base32 from "base32.js";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React from "react";
import { useContract, useSigner, useWaitForTransaction } from "wagmi";

import BountyFactory from "../../BountyFactory.json";
import { formatBytes } from "../../utils";

const InitializeStep = () => {
  const [projectName, setProjectName] = React.useState("");
  const [requirements, setRequirements] = React.useState("");
  const [file, setFile] = React.useState<lighthouse.IpfsFileResponse | null>(
    null
  );
  const bountyAmountRef = React.useRef<HTMLInputElement>(null);
  const taskRouter = useRouter();

  const progressCallback = (progressData: any) => {
    const percentageDone =
      100 - ((progressData?.total / progressData?.uploaded) as any)?.toFixed(2);
    console.log(percentageDone);
  };

  const handleUpload = async (e: string) => {
    const output = await lighthouse.uploadFileRaw(
      e,
      process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
      progressCallback
    );
    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );
    setFile(output.data);
  };

  const { data: signer } = useSigner();

  const bountyFactory = useContract({
    address: BountyFactory.address,
    abi: BountyFactory.abi,
    signerOrProvider: signer,
  });

  const handleSubmit = async () => {
    if (!file) {
      alert("Please choose a file.");
      return;
    }
    if (
      bountyAmountRef.current?.value === undefined ||
      bountyAmountRef.current?.value === null ||
      bountyAmountRef.current?.value === "" ||
      +bountyAmountRef.current.value <= 0
    ) {
      alert("Please enter a valid bounty amount.");
      return;
    }
    const bountyAmount = bountyAmountRef.current.value;

    console.log("bountyAmount", bountyAmount);
    const decoder = new base32.Decoder();
    const cid = decoder.write(file!.Hash.slice(1)).finalize();
    const createBounty = await bountyFactory!.createBounty(
      projectName,
      requirements,
      cid,
      {
        value: ethers.utils.parseEther(bountyAmount),
      }
    );
    console.log("Mining...", createBounty.hash);
    await createBounty.wait(); // !: .wait might not resolve [Cathie]

    console.log("Mined --", createBounty.hash);
    // TODO: [low priority] route to step 2 instead [Cathie]
    taskRouter.push(`/myspace`);
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
        color="secondary"
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
        color="secondary"
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
        <ListItem key={file?.Hash}>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText
            primary={file?.Name}
            secondary={formatBytes(file?.Size as number)}
            primaryTypographyProps={{
              style: {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
        </ListItem>
      </List>
      <Button
        variant="contained"
        component="label"
        sx={{
          width: "100px",
          height: "30px",
          alignSelf: "flex-end",
        }}
      >
        Upload
        <input hidden multiple type="file" onChange={handleUpload as any} />
      </Button>

      <h2>Deposit Bounty </h2>
      <Input
        inputRef={bountyAmountRef}
        color="secondary"
        placeholder="enter amount in tFIL"
        style={{ margin: "0 0 30px 0" }}
      />
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
