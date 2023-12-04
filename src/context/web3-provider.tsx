"use client";
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi'

import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'

import { optimismGoerli, sepolia, arbitrumGoerli, linea, scroll, base } from 'viem/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { ReactNode } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY!
const scrollApiKey = process.env.NEXT_PUBLIC_BLOCKPI_SCROLL_API_KEY!
const baseApiKey = process.env.NEXT_PUBLIC_BLOCKPI_BASE_API_KEY!

const { chains, publicClient } = configureChains(
  [ 
    // optimismGoerli, 
    // arbitrumGoerli, 
    // sepolia, 
    base,
    linea, 
    scroll, 
  ],
  [ 
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://scroll.blockpi.network/v1/rpc/${scrollApiKey}`,
      }),
    }),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://base.blockpi.network/v1/rpc/${baseApiKey}`,
      }),
    }),
    infuraProvider({ apiKey: infuraApiKey }),
    walletConnectProvider({ projectId }), 
  ]
)

const metadata = {
  name: 'OpenChat',
  description: 'OpenChat App',
  url: 'http://185.244.180.18:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } })
  ],
  publicClient
})

// 3. Create modal
createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains, 
  themeMode: 'light',
  themeVariables: {
    '--w3m-border-radius-master': '1px'
  }
})

export function Web3Modal({ children }: { children: ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}