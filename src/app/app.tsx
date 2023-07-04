"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets'

const customeMumbai = {
  id: 80001,
  name: 'local Testnet',
  network: 'local-testnet',
  nativeCurrency: { name: 'matic', symbol: 'matic', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://polygon-mumbai.g.alchemy.com/v2/KIUID-hlFzpnLetzQdVwO38IQn0giefR',
      ],
      webSocket: [
        'wss://polygon-mumbai.g.alchemy.com/v2/KIUID-hlFzpnLetzQdVwO38IQn0giefR',
      ],
    },
    public: {
      http: [
      'https://polygon-mumbai.g.alchemy.com/v2/KIUID-hlFzpnLetzQdVwO38IQn0giefR',
      ],
      webSocket: [
        'wss://polygon-mumbai.g.alchemy.com/v2/KIUID-hlFzpnLetzQdVwO38IQn0giefR',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'localhost',
      url: 'https://mumbai.polygonscan.com/',
    },
  },
  testnet: true,
}

const { chains, publicClient } = configureChains(
  [customeMumbai],
  [publicProvider()]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [injectedWallet({ chains })],
  },
])

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
