"use client";

import { useEffect } from "react";
import Web3 from "web3";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, zora } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "soveilive",
  projectId: "f313fb2b18faad5aecf96a210ba0bb0b",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

type PageProps = {
  children: React.ReactNode;
};

export default function Page({ children }: PageProps) {
  return (
    <div>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}
