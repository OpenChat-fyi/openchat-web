// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AblyContextProvider } from '@/context/ably-provider';
import QueryProvider from '@/context/query-provider';
import { Web3Modal } from "../context/web3-provider";
import Navbar from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpenChat',
  description: 'Decentralized chat App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-gray-50 ${inter.className}`}>
        <QueryProvider>
          <AblyContextProvider>
            <Web3Modal>
              <Navbar />
              {children}
            </Web3Modal>
          </AblyContextProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
