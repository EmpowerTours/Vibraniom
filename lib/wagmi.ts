import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";

export const monadTestnet = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL!] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://explorer.monad.xyz" },
  },
});

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      metadata: {
        name: "Vibraniom",
        description: "Music App",
        url: process.env.NEXT_PUBLIC_APP_URL || "https://vibraniom-production.up.railway.app",
        icons: [],
      },
      showQrModal: true,
    }),
    injected(), // Supports Getpara and other injected wallets
    coinbaseWallet({ appName: "Vibraniom" }),
  ],
  transports: {
    [monadTestnet.id]: http(),
  },
});
