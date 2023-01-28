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
        width: 90%;
        margin-left: 10%;
        margin-top: 60px;
      `}
    >
      {children}
    </div>
  );
};

export default MainFlow;
