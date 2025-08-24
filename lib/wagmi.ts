import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';  // For connectors

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
});

const { connectors } = getDefaultWallets({
  appName: 'Vibraniom',
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID',  // Add your WalletConnect ID
  chains: [monadTestnet],
});

export const config = createConfig({
  chains: [monadTestnet],
  connectors,
  transports: {
    [monadTestnet.id]: http(),
  },
});
