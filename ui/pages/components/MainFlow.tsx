import { css } from "@emotion/react";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const MainFlow = ({ children }: LayoutProps) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 80%;
        margin-left: 20%;
        margin-top: 60px;
      `}
    >
      {children}
    </div>
  );
};

export default MainFlow;

