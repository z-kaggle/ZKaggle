import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Task } from "../typings";
import { autocompleteClasses } from "@mui/material";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const card = ({ task }: { task: Task }) => (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {task.bounty}ETH
      </Typography>
      <Typography variant="h5" component="div">
        {task.name}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {/* {task.category} */}
      </Typography>
      <Typography variant="body2">
        {task.requirements}
        <br />
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">Take it NOW</Button>
    </CardActions>
  </React.Fragment>
);

export default function ColCard({ task }: { task: Task }) {
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
