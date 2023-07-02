"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Connect() {
  return (
    <ConnectButton
      chainStatus="none"
      accountStatus="avatar"
      showBalance={false}
    />
  );
}
