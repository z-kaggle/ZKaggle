import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";

import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@rainbow-me/rainbowkit/styles.css";

import { filecoin, filecoinHyperspace } from "./api/chain.config";

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#fffbfe",
      contrastText: "#6750a4",
      dark: "#d1c4e9",
    },
    secondary: {
      main: "#6750a4",
    },
    background: {
      default: "#fffbfe",
    },
  },
};

const theme = createTheme(themeOptions);

const { chains, provider } = configureChains(
  [filecoinHyperspace, filecoin],
  [
    // only endpoint that support Ethereum API requests
    jsonRpcProvider({
      priority: 0,
      rpc: () => ({
        http: `https://api.hyperspace.node.glif.io/rpc/v1`,
      }),
    }),
    // only support filecoin API requests
    jsonRpcProvider({
      priority: 1,
      rpc: () => ({
        http: `https://api.hyperspace.node.glif.io/`,
      }),
    }),
    jsonRpcProvider({
      priority: 2,
      rpc: () => ({
        http: `https://api.hyperspace.node.glif.io/rpc/v0`,
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          accentColor: "white",
          accentColorForeground: "#6750A4",
        })}
      >
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
