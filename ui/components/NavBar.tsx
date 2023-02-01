import { NextComponentType } from "next";
import { css } from "@emotion/react";
import { Button } from "@mui/material";
import Link from "next/link";
import { Add } from "@mui/icons-material";
import StarIcon from "@mui/icons-material/Star";
import NavList from "./NavList";

const NavBar: NextComponentType = () => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background-color: #ffffff;
        position: fixed;
        top: 0;
        left: 0;
        min-width: 10%;
        max-width: 20%;
        height: 100vh;
        z-index: 2;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.3));
        overflow: hidden;
      `}
    >
      <Link
        href={`/`}
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 15px;
          margin-bottom: 15px;
        `}
      >
        <StarIcon
          sx={{
            color: "#6750a4",
            marginLeft: "20px",
          }}
        />
        <p
          css={css`
            font-weight: 700;
            font-size: 24px;
            color: #6750a4;
            margin-left: 5px;
            margin-right: 10px;
            margin-top: 0;
            margin-bottom: 0;
          `}
        >
          ZKaggle
        </p>
      </Link>

      <Link href={`/create`}>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            borderRadius: "30px",
            height: "50px",
            width: "120px",
            alignSelf: "flex-end",
            marginLeft: "5px",
          }}
        >
          Create
        </Button>
      </Link>
      <NavList />
    </div>
  );
};

export default NavBar;
