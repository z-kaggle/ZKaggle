import { css } from "@emotion/react";
import { Chip } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import * as React from "react";

import { Task } from "../typings";

interface FlowCardProps {
  task: Task;
  expanded: boolean;
}

export default function FlowCard({ task, expanded }: FlowCardProps) {
  const theme = useTheme();
  const taskRouter = useRouter();
  return (
    <Box
      sx={{
        minWidth: expanded ? 300 : 200,
        maxWidth: expanded ? 500 : 300,
        marginRight: "10px",
        marginBottom: "10px",
        borderRadius: "50px",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          border: "0.5px solid #E5E5E5",
          borderRadius: "20px",
          backgroundColor: theme.palette.primary.main,
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            cursor: "pointer",
            transform: "scale(1.05)",
            transition: "transform 0.3s ease-in-out",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
          },
        }}
        onClick={() => taskRouter.push(`/tasks/${task.address}`)}
      >
        <CardContent>
          <div
            css={css`
              display: flex;
              align-items: flex-start;
            `}
          >
            <Chip
              label={task.isCompleted ? "Completed" : "In Progress"}
              sx={{
                backgroundColor: task.isCompleted
                  ? ""
                  : theme.palette.primary.contrastText,
                color: "white",
                borderRadius: "50px",
                marginBottom: "10px",
                marginRight: "10px",
                fontSize: "12px",
                height: "20px",
              }}
            />
            <Chip
              label={task.bountyAmount + " tFil"}
              variant={task.isCompleted ? "default" : "outlined"}
              sx={{
                color: task.isCompleted
                  ? "white"
                  : theme.palette.primary.contrastText,
                borderRadius: "50px",
                marginBottom: "10px",
                marginRight: "10px",
                fontSize: "12px",
                height: "20px",
              }}
            ></Chip>
          </div>

          <Typography variant="h5" component="div">
            {task.name}
          </Typography>
          <Typography variant="body2">{task.description}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
