import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Link from "next/link";

export default function NavList() {
  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <nav aria-label="main mailbox folders">
        <List>
          <Link href="/">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon
                  sx={{
                    marginLeft: "5px",
                  }}
                >
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Feed"
                  sx={{
                    marginLeft: "-25px",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link>

          <Link href={`/myspace`}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon
                  sx={{
                    marginLeft: "5px",
                  }}
                >
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText
                  primary="MySpace"
                  sx={{
                    marginLeft: "-25px",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </nav>
    </Box>
  );
}