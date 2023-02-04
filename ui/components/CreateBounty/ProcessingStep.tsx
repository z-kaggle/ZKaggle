import { css } from "@emotion/react";
import lighthouse from "@lighthouse-web3/sdk";
import FolderIcon from "@mui/icons-material/Folder";
import {
  Button,
  Divider,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React from "react";
import { useAccount, useSigner } from "wagmi";
import { useContract } from "wagmi";

import Bounty from "../../Bounty.json";
import BountyFactory from "../../BountyFactory.json";
import { Task } from "../../typings";
import { formatBytes } from "../../utils";
import base32 from "base32.js";

type ProcessingStepProps = {
  task: Task;
};

const ProcessingStep = ({ task }: ProcessingStepProps) => {
  const { address } = useAccount();
  const [isBountyOwner, setIsBountyOwner] = React.useState(task.bountyOwner === address);

  const [zkeyFile, setZkeyFile] =
    React.useState<lighthouse.IpfsFileResponse | null>(null);
  const [circomFile, setCircomFile] =
    React.useState<lighthouse.IpfsFileResponse | null>(null);
  const [verifierFile, setVerifierFile] =
    React.useState<lighthouse.IpfsFileResponse | null>(null);

  const verifierAddressRef = React.useRef<HTMLInputElement>(null);
  const zkProofRef = React.useRef<HTMLInputElement>(null);

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

  const signAuthMessage = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const publicKey = (await signer.getAddress()).toLowerCase();
    const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return { publicKey: publicKey, signedMessage: signedMessage };
  };

  const handleZkeyUpload = async (e: string) => {
    const sig = await signAuthMessage();
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

    console.log("Sharing file with contract owner: " + [task.bountyOwner]);

    const res = await lighthouse.shareFile(
      publicKey,
      [task.bountyOwner],
      output.data.Hash,
      signedMessage
    );

    console.log(res);
    setZkeyFile(output.data);
  };

  const handleCircomUpload = async (e: string) => {
    const sig = await signAuthMessage();
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

    console.log("Sharing file with contract owner: " + [task.bountyOwner]);

    const res = await lighthouse.shareFile(
      publicKey,
      [task.bountyOwner],
      output.data.Hash,
      signedMessage
    );

    console.log(res);
    setCircomFile(output.data);
  };

  const handleVerifierUpload = async (e: string) => {
    const sig = await signAuthMessage();
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

    console.log("Sharing file with contract owner: " + [task.bountyOwner]);

    const res = await lighthouse.shareFile(
      publicKey,
      [task.bountyOwner],
      output.data.Hash,
      signedMessage
    );

    console.log(res);
    setVerifierFile(output.data);
  };

  const handleSubmit = async () => {
    if (!zkeyFile || !circomFile || !verifierFile) {
      alert("Please upload all files.");
      return;
    }
    if (
      zkProofRef.current?.value === undefined ||
      zkProofRef.current?.value === null ||
      zkProofRef.current?.value === ""
    ) {
      alert("Please enter ZK proof.");
      return;
    }
    if (
      verifierAddressRef.current?.value === undefined ||
      verifierAddressRef.current?.value === null ||
      verifierAddressRef.current?.value === ""
    ) {
      alert("Please enter verifier address.");
      return;
    }

    // format zkProof
    let a, b, c, Input;
    try {
      const argv = zkProofRef.current.value.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

      a = [argv[0], argv[1]];
      b = [[argv[2], argv[3]], [argv[4], argv[5]]];
      c = [argv[6], argv[7]];
      Input = argv.slice(8);
    } catch (e) {
      alert("Please enter ZK proof in correct format.");
      return;
    }

    const submitBounty = await bounty!.submitBounty(
      Buffer.from(zkeyFile!.Hash),
      Buffer.from(circomFile!.Hash),
      Buffer.from(verifierFile!.Hash),
      verifierAddressRef.current.value,
      a, b, c, Input
    );
    console.log("Mining...", submitBounty.hash);
    await submitBounty.wait();

    // TODO: check if taskRouter.push is working [Cathie]
    console.log("Mined --", submitBounty.hash);
    taskRouter.push(`/tasks/${task.address}`);
  };

  const urlPrefix = "https://files.lighthouse.storage/viewFile/"

  const openDataFile = () => {
    const encoder = new base32.Encoder();
    const cid = 'b' + encoder.write(ethers.utils.arrayify(task.dataCID)).finalize().toLowerCase();
    window.open(urlPrefix + cid, "_blank");
  }


  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        max-width: 50%;
        min-width: 300px;
      `}
    >
      {isBountyOwner ? (
        <>
          <h2>This task is waiting for bounty hunter to pick up...</h2>
          <h5>This might take a while, come back to check the progress later!</h5>
        </>
      ) : (
        <>
          <h2>Upload your computed results ASAP</h2>
          <h5>Bounty submissions are first-come-first-served.</h5>
        </>
      )}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          max-width: 35vw;
          min-width: 300px;
        `}
      >
        <Stack paddingTop={6} spacing={0}>
          <Stack direction="row" spacing={10} justifyContent="space-between">
            <h2 style={{ padding: "0", margin: "0" }}>{task.name}</h2>
            <Button
              variant="outlined"
              sx={{
                width: "150px",
                alignSelf: "flex-end",
              }}
            >
              {task.bountyAmount} tFIL
            </Button>
          </Stack>
          <h5>{task.description}</h5>
        </Stack>

        {!isBountyOwner ? (
          <>
            <Divider
              css={css`
            margin-top: 40px;
            margin-bottom: 20px;
          `}
            />
            {/* download data file */}
            <h2>Download task data</h2>
            <Button
              variant="outlined"
              component="label"
              sx={{
                width: "300px",
                alignSelf: "flex-end",
                marginBottom: "40px",
              }}
              onClick={() => openDataFile()}
            >
              View data file
            </Button>
            <Divider
              css={css`
            margin-top: 40px;
            margin-bottom: 20px;
          `}
            />
            {/* upload zkey file */}
            <h2>Upload zkey</h2>
            <List dense={true}>
              <ListItem key={zkeyFile?.Hash}>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  primary={zkeyFile?.Name}
                  secondary={formatBytes(zkeyFile?.Size as number)}
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
              variant="outlined"
              component="label"
              sx={{
                width: "150px",
                alignSelf: "flex-end",
              }}
            >
              Upload zkey
              <input
                hidden
                type="file"
                onChange={handleZkeyUpload as any}
              />
            </Button>


            {/* upload circuit */}
            <h2>Upload Circom file</h2>
            <List dense={true}>
              <ListItem key={circomFile?.Hash}>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  primary={circomFile?.Name}
                  secondary={formatBytes(circomFile?.Size as number)}
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
              variant="outlined"
              component="label"
              sx={{
                width: "150px",
                alignSelf: "flex-end",
              }}
            >
              Upload Circom
              <input
                hidden
                type="file"
                onChange={handleCircomUpload as any}
              />
            </Button>


            {/* upload verifier.sol */}
            <h2>Upload verifier.sol</h2>
            <List dense={true}>
              <ListItem key={verifierFile?.Hash}>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  primary={verifierFile?.Name}
                  secondary={formatBytes(verifierFile?.Size as number)}
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
              variant="outlined"
              component="label"
              sx={{
                width: "150px",
                alignSelf: "flex-end",
              }}
            >
              Upload sol
              <input
                hidden
                type="file"
                onChange={handleVerifierUpload as any}
              />
            </Button>

            <h2>Verifier Contract Address</h2>
            <Input
              inputRef={verifierAddressRef}
              placeholder="Enter verifier address (must be deployed on Hyperspace testnet)"
              style={{ margin: "0 0 30px 0" }}
            />
            <h2>ZK Proof</h2>
            <Input
              inputRef={zkProofRef}
              placeholder="Enter verifier calldata from snarkjs"
              style={{ margin: "0 0 30px 0" }}
            />

            <Button
              variant="contained"
              component="label"
              sx={{
                width: "100px",
                alignSelf: "flex-end",
                marginBottom: "40px",
              }}
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </>) : null}

        {/* for development purpose */}
        {/* <Button onClick={
          () => {
            setIsBountyOwner(false);
          }}>
          Switch to bounty hunter
        </Button>
        <Button onClick={
          () => {
            setIsBountyOwner(true);
          }}>
          Switch to bounty owner
        </Button> */}
      </div></div>
  );
};

export default ProcessingStep;
