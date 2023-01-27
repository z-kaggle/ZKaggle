import { NextComponentType } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { css } from "@emotion/react";
import SearchBar from "./SearchBar";

const TopBar: NextComponentType = () => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff000;
        position: absolute;
        top: 0;
        right: 0;
        width: 80%;
        height: 60px;
        padding-left: 10px;
      `}
    >
      <SearchBar
        css={css`
          margin-left: 100px;
          flex: 1 0 auto;
        `}
      />
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
