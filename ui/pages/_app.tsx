import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { filecoin, filecoinHyperspace } from "./chain.config";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";

const { chains, provider } = configureChains(
  [filecoinHyperspace, filecoin],
  [
    jsonRpcProvider({
      priority: 0,
      rpc: (chain) => ({
        http: `https://api.hyperspace.node.glif.io/`,
        webSocket: `wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v0`,
      }),
    }),
    jsonRpcProvider({
      priority: 1,
      rpc: (chain) => ({
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
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
