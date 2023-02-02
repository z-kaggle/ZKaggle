import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import * as React from "react";

import { Task } from "../typings";

interface FlowCardProps {
  task: Task;
}

const card = ({ task }: FlowCardProps) => (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {task.name}
      </Typography>
      <Typography variant="h5" component="div">
        {task.name}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {task.description}
      </Typography>
      <Typography variant="body2">
        {task.dataCID}
        <br />
      </Typography>
    </CardContent>
    <CardActions>
      <Link href={`/tasks/${task.address}`}>
        <Button size="small">Take a Look</Button>
      </Link>
    </CardActions>
  </React.Fragment>
);

export default function FlowCard({ task }: FlowCardProps) {
  return (
    <Box
      sx={{
        minWidth: 150,
        maxWidth: 200,
        marginRight: "10px",
        marginBottom: "10px",
      }}
    >
      <Card variant="outlined">{card({ task })}</Card>
    </Box>
  );
}
