import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";

const projectId = "your-walletconnect-project-id"; // Replace with your Reown project ID

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
    walletConnect({ projectId, metadata: { name: "Vibraniom", description: "Music App", url: "https://yourapp.com", icons: [] }, showQrModal: true }),
    injected(),
    coinbaseWallet({ appName: "Vibraniom" }),
  ],
  transports: {
    [monadTestnet.id]: http(),
  },
});
