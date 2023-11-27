// app/page.tsx
"use client";
import dynamic from 'next/dynamic'
const MessageItem = dynamic(() => import('@/components/message-item'), { ssr: false });
import { Button } from '@/shadcn-components/ui/button';
import { Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shadcn-components/ui/card'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

type ChainName = 'Optimism' | 'Arbitrum' | 'Ethereum';

const MOCK_MESSAGES = {
  "message_1": {
    id: '0x7737c3832f959ba45008d5402738e835154c898cbd4cbe9b7545ec261d8e3f9f',
    sender: '0x8937bfa96881641cd7efd4a0bf8b308b5807130f',
    chain: {
      id: '11155111',
      name: 'Sepolia'
    },
    time_data: {
      iat: new Date(1700758508391)
    },
    message: 'Don\'t you see that the whole aim of Newspeak is to narrow the range of thought? In the end we shall make thoughtcrime literally impossible, because there will be no words in which to express it.'
  },
  "message_2": {
    id: '0x760118aa0c38f6a913982b26e335bbb181101b5e7a6d6df290c46022b6d26d55',
    sender: '0xfd9bf50097a98214034f85afea87b8c9e1de5ae3',
    chain: {
      id: '420',
      name: 'Optimism Goerli'
    },
    time_data: {
      iat: new Date(1700759399348)
    },
    message: 'Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.'
  },
  "message_3": {
    id: '0xb615ab05d8e46f9d28eeee515b061d0e052a870c7a1b1c3e4c43a84ca668d689',
    sender: '0xec3adf42920bb332fb62d0bb272b47bb8e225505',
    chain: {
      id: '421613',
      name: 'Arbitrum Goerli'
    },
    time_data: {
      iat: new Date(1700760267391)
    },
    message: 'The Party told you to reject the evidence of your eyes and ears. It was their final, most essential command.'
  },
  "message_4": {
    id: '0x252de55d31ac68c0c2794237c982760f9cde09ab18d213d4a250034f6f269e55',
    sender: '0xfd9bf50097a98214034f85afea87b8c9e1de5ae3',
    chain: {
      id: '420',
      name: 'Optimism Goerli'
    },
    time_data: {
      iat: new Date(1700760267391)
    },
    message: 'In the face of pain there are no heroes.'
  },
}

interface FeatureCardProps {
  title: string;
  text: string;
  icon: string;
}

const FeatureCard = ({title, text, icon}: FeatureCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon icon={icon} className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
        {/* <CardDescription>blabh.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <p>{text}</p>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [chainScroll, setChainScroll] = useState<ChainName>('Optimism');
  const chains: ChainName[] = ['Optimism', 'Arbitrum', 'Ethereum'];

  const chainColors: Record<ChainName, string> = {
    'Optimism': 'bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500',
    'Arbitrum': 'bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-500',
    'Ethereum': 'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300'
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setChainScroll(prevChain => {
        const currentIndex = chains.indexOf(prevChain);
        const nextIndex = (currentIndex + 1) % chains.length;
        return chains[nextIndex];
      });
    }, 3000); // Change the chain every 3 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  return (
    <main className="flex flex-col items-start space-y-4 justify-between px-4 md:px-72 py-8 pt-32 max-h-screen">
      <div className="flex flex-col sm:flex-row w-full sm:items-start sm:space-x-4 sm:space-y-0">
        <div className="w-full sm:w-1/2 space-y-4">
          <p className='text-xl'>
            <span className="font-bold text-2xl">
              OpenChat&nbsp;
            </span>
            is an open source multi-chain chat room created to empower freedom of speech by means of Web3 technology.
          </p>
          <p className='text-xl'>
            The project supports multiple EVM chains, including <span className={`${chainColors[chainScroll]} font-extrabold`}>{chainScroll}</span>. The list of supported chains is constantly growing.
          </p>
          <div className='w-full pb-4'>
            <Link href="/chat">
                <Button variant='outline' className='w-full max-sm:h-11'>Say Hi 👋</Button>
            </Link>
          </div>
        </div>
        <div className="w-full sm:w-1/2 space-y-2">
          <MessageItem message={MOCK_MESSAGES['message_1']} noAvatar={true}/>
          {/* <MessageItem message={MOCK_MESSAGES['message_2']} noAvatar={true}/> */}
          <MessageItem message={MOCK_MESSAGES['message_3']} forceSender={true} />
          <MessageItem message={MOCK_MESSAGES['message_4']} noAvatar={true}/>
        </div>
      </div>
          <div className="flex flex-col items-center justify-center w-full px-4">
            <p className="font-bold text-xl">
              Full Send
            </p>
            <p className='text-lg'>
                OpenChat is packed with features that make up a true decentralized chat experience
              </p>
          </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <FeatureCard title='Secure' text='User messages are sent over TLS and encrypted by default, each message is cryptographically signed' icon='lucide:lock'/>
        <FeatureCard title='Fast' text='We use Ably, the industry leader in pub/sub technology to deliver messages at lightspeed' icon='lucide:rocket'/>
        <FeatureCard title='Decentralized' text='Messages are signed and persisted on the blockchain thus making them impossible to censor' icon='lucide:network'/>
      </div>
    </main>
  )
  // return (
  //   <main className="px-3 md:px-64 py-8 pt-16 max-h-screen">
  //     <Card>
  //       <CardContent className="flex flex-col items-start space-y-4 justify-between p-4 pt-12 pr-0" >
  //         <div className="flex flex-col sm:flex-row w-full sm:items-start sm:space-x-4 sm:space-y-0">
  //           <div className="w-full sm:w-1/2 space-y-4 pr-4">
  //             <p className='text-xl'>
  //               <span className="font-bold text-2xl">
  //                 OpenChat&nbsp;
  //               </span>
  //               is an open source multi-chain chat room created to empower freedom of speech by means of Web3 technology.
  //             </p>
  //             <p className='text-xl'>
  //               The project supports multiple EVM chains, including <span className={`${chainColors[chainScroll]} font-extrabold`}>{chainScroll}</span>. The list of supported chains is constantly growing.
  //             </p>
  //             <div className='w-full pb-4'>
  //               <Link href="/chat">
  //                   <Button variant='outline' className='w-full max-sm:h-11'>Say Hi 👋</Button>
  //               </Link>
  //             </div>
  //           </div>
  //           <div className="w-full sm:w-1/2 space-y-2 bg-gradient-to-br from-blue-500 via-blue-400 to-purple-500 to-pink-500 p-4 rounded-l-lg -mr-4">
  //             <MessageItem message={MOCK_MESSAGES['message_1']} noAvatar={true} doGlass={true}/>
  //             {/* <MessageItem message={MOCK_MESSAGES['message_2']} noAvatar={true}/> */}
  //             <MessageItem message={MOCK_MESSAGES['message_3']} forceSender={true} doGlass={true}/>
  //             <MessageItem message={MOCK_MESSAGES['message_4']} noAvatar={true} doGlass={true}/>
  //           </div>
  //         </div>
  //         <div className="flex flex-col items-center justify-center w-full px-4">
  //           <p className="font-bold text-xl">
  //             Full Send
  //           </p>
  //           <p className='text-lg'>
  //               OpenChat is packed with features that make up a true decentralized chat experience
  //             </p>
  //         </div>
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pr-4">
  //           <FeatureCard title='Secure' text='User messages are sent over TLS and encrypted by default, each message is cryptographically signed' icon='lucide:lock'/>
  //           <FeatureCard title='Fast' text='We use Ably, the industry leader in pub/sub technology to deliver messages at lightspeed' icon='lucide:rocket'/>
  //           <FeatureCard title='Decentralized' text='Messages are signed and persisted on the blockchain thus making them impossible to censor' icon='lucide:network'/>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   </main>
  // )
}