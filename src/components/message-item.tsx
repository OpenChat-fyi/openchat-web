"use client";
import { Card, CardContent, CardFooter } from '@/shadcn-components/ui/card'
import { Avatar } from '@/shadcn-components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shadcn-components/ui/tooltip'
import Jdenticon from 'react-jdenticon';
import { useAccount } from 'wagmi';
import React from 'react';
import { CHAIN_CONFIG, ChainList } from '@/app/chat/chat-main';
import { MessageComponentProps } from '@/types/custom';
  
function Identicon(address: string){
    return(<Jdenticon size="40" value={address} />);
}

export const MessageItem = ({message, forceSender, noAvatar}: MessageComponentProps) => {
  const { address } = useAccount()
  const sender = message.sender.toLowerCase() === address?.toLowerCase() || forceSender

  const formattedContent = message.message.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className={`w-full flex items-start ${sender ? 'justify-end' : 'justify-start'}`}>
      {!sender && !noAvatar ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar>
                {Identicon(message.sender)}
              </Avatar> 
            </TooltipTrigger>
            <TooltipContent>
              <p>{message.sender}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null }
      <div className={`w-3/4 ${sender ? 'flex justify-end' : ''}`}>
        <div className={`relative inline-block`}>
          <Card className={`shadow-none ${sender ? message.isLoading ? 'bg-secondary border-dashed border-gray-500' : 'bg-accent' : 'bg-card'}`}>
            <CardContent className={`p-2 ${message.isLoading ? 'text-gray-500' : ''}`}>
              <p className='break-all'>{formattedContent}</p>
            </CardContent>
            <CardFooter className='p-2 text-xs text-gray-500 text-right flex justify-between'>
              <p>{new Date(message.time_data.iat).toLocaleString()}</p>
              <p className='pl-1'>via <a href={`${CHAIN_CONFIG[message.chain.id as ChainList].explorer}${message.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', fontStyle: 'italic' }}>{message.chain.name}</a></p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MessageItem