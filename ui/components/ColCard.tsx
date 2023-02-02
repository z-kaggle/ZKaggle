import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Task } from "../typings";
import Link from "next/link";

interface ColCardProps {
  task: Task;
}

const card = ({ task }: ColCardProps) => (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {task.name}
      </Typography>
      <Typography variant="h5" component="div">
        {task.name}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {task.name}ETH
      </Typography>
      <Typography variant="body2">
        {task.description}
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

export default function ColCard({ task }: ColCardProps) {
  return (
    <Box
      sx={{
        // not responsive
        minWidth: 500,
        marginRight: "10px",
        marginBottom: "10px",
      }}
    >
      <Card variant="outlined">{card({ task })}</Card>
    </Box>
  );
}
