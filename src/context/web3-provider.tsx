"use client";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi";

import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";

import { optimismGoerli, sepolia, arbitrumGoerli, linea, scroll, base } from "viem/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ReactNode } from "react";
import { defineChain } from "viem";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY!;
const scrollApiKey = process.env.NEXT_PUBLIC_BLOCKPI_SCROLL_API_KEY!;
const baseApiKey = process.env.NEXT_PUBLIC_BLOCKPI_BASE_API_KEY!;
const blastApiKey = process.env.NEXT_PUBLIC_BLAST_SEPOLIA_API_KEY!;

export const blastSepolia = /*#__PURE__*/ defineChain({
	id: 168_587_773,
	name: "Blast Sepolia",
	network: "blastSepolia",
	nativeCurrency: {
		name: "Ether",
		symbol: "ETH",
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: ["https://rpc.ankr.com/blast_testnet_sepolia/${blastApiKey}", "https://sepolia.blast.io"],
		},
		public: {
			http: ["https://rpc.ankr.com/blast_testnet_sepolia/${blastApiKey}", "https://sepolia.blast.io"],
		},
	},
	blockExplorers: {
		default: {
			name: "Blastscan",
			url: "https://testnet.blastscan.io",
		},
	},
	testnet: true,
});

const { chains, publicClient } = configureChains(
	[
		// optimismGoerli,
		// arbitrumGoerli,
		// sepolia,
		blastSepolia,
		base,
		linea,
		scroll,
	],
	[
		publicProvider(),
		jsonRpcProvider({
			rpc: (chain) => ({
				http: `https://rpc.ankr.com/blast_testnet_sepolia/${blastApiKey}`,
			}),
		}),
		jsonRpcProvider({
			rpc: (chain) => ({
				http: `https://sepolia.blast.io`,
			}),
		}),
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
);

const metadata = {
	name: "OpenChat",
	description: "OpenChat App",
	url: "https://openchaty.fun",
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors: [
		new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
		new InjectedConnector({ chains, options: { shimDisconnect: true } }),
		new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } }),
	],
	publicClient,
});

// 3. Create modal
createWeb3Modal({
	wagmiConfig,
	projectId,
	chains,
	themeMode: "light",
	themeVariables: {
		"--w3m-border-radius-master": "1px",
	},
});

export function Web3Modal({ children }: { children: ReactNode }) {
	return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
