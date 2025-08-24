import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { defineChain } from 'viem'
import { createConfig, http } from 'wagmi'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

// Define Monad Testnet
export const monadTestnet = defineChain({
  id: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '10143'),
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://testnet-rpc.monad.xyz/'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com/' },
  },
  testnet: true,
})

// Get projectId from https://cloud.reown.com/
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Create wagmi config with enhanced wallet support
export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    walletConnect({
      projectId,
      metadata: {
        name: "Vibraniom",
        description: "Music App on Monad",
        url: process.env.NEXT_PUBLIC_APP_URL || "https://vibraniom-production.up.railway.app",
        icons: [],
      },
      showQrModal: true,
    }),
    injected(), // Supports Getpara and other injected wallets
    coinbaseWallet({ appName: "Vibraniom" }),
  ],
  transports: {
    [monadTestnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
})

// Networks for AppKit
export const networks = [monadTestnet] as [AppKitNetwork, ...AppKitNetwork[]]

// Set up Wagmi Adapter for AppKit
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks
})

// Create AppKit instance
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: monadTestnet,
  metadata: {
    name: 'Vibraniom',
    description: 'Music App on Monad',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://vibraniom-production.up.railway.app',
    icons: []
  },
  features: {
    analytics: true,
  }
})
