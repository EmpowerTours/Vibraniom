import { defineChain } from 'viem'
import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'

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

// Simple config with just injected wallet (supports Getpara, MetaMask, etc.)
export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected(), // Supports Getpara and other injected wallets
  ],
  transports: {
    [monadTestnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
  ssr: true,
})
