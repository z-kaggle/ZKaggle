import { NextComponentType } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { css } from "@emotion/react";
import SearchBar from "./TopSearchBar";

const TopBar: NextComponentType = () => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #ffffff;
        position: fixed;
        top: 0;
        right: 0;
        width: 80%;
        height: 60px;
        z-index: 1;
      `}
    >
      <div
        css={css`
          margin-left: 10%;
          margin-right: 5%;
          flex: 1 1 auto;
        `}
      >
        <SearchBar />
      </div>

      <div
        css={css`
          margin-right: 10px;
          margin-left: 10px;
          flex: 0 0 auto;
        `}
      >
        <ConnectButton />
      </div>
    </div>
  );
};

export default TopBar;
