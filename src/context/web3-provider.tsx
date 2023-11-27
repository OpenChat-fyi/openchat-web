// "use client";

// import { createWeb3Modal, defaultWagmiConfig, useWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react'

// import { WagmiConfig } from 'wagmi'
// import { optimismGoerli, sepolia, arbitrumGoerli } from 'viem/chains'

// // 1. Get projectId at https://cloud.walletconnect.com
// const projectId = '51afd8a7bd88ae02dbbbfa6ee148a697'

// // 2. Create wagmiConfig
// const metadata = {
//   name: 'Web3Modal',
//   description: 'Web3Modal Example',
//   url: 'https://web3modal.com',
//   icons: ['https://avatars.githubusercontent.com/u/37784886']
// }

// const chains = [optimismGoerli, arbitrumGoerli, sepolia]
// const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// // 3. Create modal
// createWeb3Modal({ 
//   wagmiConfig, 
//   projectId, 
//   chains, 
//   themeMode: 'light',
//   themeVariables: {
//     '--w3m-border-radius-master': '1px'
//   }
// })

// export function Web3Modal({ children }) {
//   return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
// }

"use client";
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi'

import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'

import { optimismGoerli, sepolia, arbitrumGoerli } from 'viem/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ReactNode } from 'react';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '51afd8a7bd88ae02dbbbfa6ee148a697'

// 2. Create wagmiConfig
const { chains, publicClient } = configureChains(
  [optimismGoerli, arbitrumGoerli, sepolia],
  [walletConnectProvider({ projectId }), publicProvider(), infuraProvider({ apiKey: 'b2b567b229984f4299f9ca3d211ebbdb' })]
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
    // new EIP6963Connector({ chains }),
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