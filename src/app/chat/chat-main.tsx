// app/chat/page.tsx
"use client"
import dynamic from 'next/dynamic'
import { Input } from '@/shadcn-components/ui/input';
import { useAccount, useNetwork, usePrepareContractWrite, useContractWrite } from 'wagmi';
import React, { useState, useEffect, useRef } from 'react'
import { useChannel } from 'ably/react'
import axios from 'axios';
import { MessageItem } from '@/components/message-item'
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Message } from '@/types/custom';
import { EmojiPicker } from '@/components/emoji-picker';

const MessageButton = dynamic(() => import('@/components/buttons').then((mod) => mod.MessageButton))

const API_URL = process.env.NEXT_PUBLIC_API_URL
export type ChainList = "11155111" | "420" | "421613"
export const CHAIN_CONFIG = {
  "11155111": {
      contract: '0x80fAb1fdE6C8216DE73112d207602930E118850b',
      explorer: 'https://sepolia.etherscan.io/tx/'
  },
  "420": {
      contract: '0x5A0B048F1c5BCeFfccC04931F934634D3cF6C65b',
      explorer: 'https://goerli-optimism.etherscan.io/tx/'
  },
  "421613": {
      contract: '0xa8036D3BB3f4ff91C5c92a14CBE2348Bb79435da',
      explorer: 'https://goerli.arbiscan.io/tx/'
  }
}
const fetchMessages = async ({ pageParam }: { pageParam: number }) => {
  const response = await axios.get(`${API_URL}/message?page=${pageParam}`);
  return { messages: response.data, nextCursor: response.data.length ? response.data.length === 50 ? pageParam + 1 : undefined : undefined };
};
const sendMessageToServer = async (message: Message) => {
  const response = await axios.post(`${API_URL}/message`, message);
  return response.data;
};

export default function ChatMain() {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { config } = usePrepareContractWrite({
    address: CHAIN_CONFIG[chain?.id?.toString() as ChainList]?.contract as `0x{string}`,
    abi: [
      {
        name: 'message',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: [],
      },
    ],
    functionName: 'message',
  })
  const { data: write_data, isLoading: write_isLoading, isSuccess: write_isSuccess, isError: write_isError, write } = useContractWrite(config)
  const queryClient = useQueryClient()
  const { channel } = useChannel("openchat:messages", (event) => {
    console.log(event);
    const message: Message = event.data
    if (message.sender !== address?.toLowerCase()) {
      queryClient.setQueryData(['messages'], (old: any) => {
        const newPages = old.pages.map((page: any, index: number) => {
          // Only update the last page
          if (index === old.pages.length - 1) {
            return {
              ...page,
              messages: [message, ...page.messages],
            };
          } else {
            return page;
          }
        });
      
        return {
          ...old,
          pages: newPages,
        };
      });
    }
  });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
      queryKey: ['messages'], 
      queryFn: fetchMessages, 
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    });
  const { mutate } = useMutation({
    mutationKey: ['addMessage'],
    mutationFn: sendMessageToServer,
    // Optimistic update
    onMutate: async (newMessage: Message) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['messages'] });
  
      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(['messages']);

      console.log(previousMessages)

      queryClient.setQueryData(['messages'], (old: any) => {
        const newPages = old.pages.map((page: any, index: number) => {
          // Only update the last page
          if (index === old.pages.length - 1) {
            console.log('yolo')
            return {
              ...page,
              messages: [newMessage, ...page.messages],
            };
          } else {
            return page;
          }
        });
      
        return {
          ...old,
          pages: newPages,
        };
      });
  
      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    // If the mutation fails, roll back to the previous value
    onError: (err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages'], context.previousMessages);
      }
    },
    // Always refetch after error or success:
    onSettled: (data, error, variables, context) => {
      const newMessage = { ...variables, isLoading: false };
      queryClient.setQueryData(['messages'], (old: any) => {
        const newPages = old.pages.map((page: any, index: number) => {
          if (index === old.pages.length - 1) {
            return {
              ...page,
              messages: page.messages.map((message: Message) => message.id === newMessage.id ? newMessage : message),
            };
          } else {
            return page;
          }
        });
    
        return {
          ...old,
          pages: newPages,
        };
      });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (write_isSuccess) {
      const newMessage: Message = {
        id: write_data?.hash || '',
        sender: address || '', 
        message: input!, 
        time_data: { iat: new Date() }, 
        chain: { 
          name: chain?.name || '', 
          id: chain?.id.toString() || ''
        },
        isLoading: true,
      };
  
      mutate(newMessage);
      setInput('');
    }
  }, [write_isSuccess]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
  
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
  
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  function _sendMessage () { write?.() }  

  return (
    <main className="flex flex-col min-h-screen items-center justify-between px-4 md:px-72 py-8 pt-11 max-h-screen">
      <div className='w-full h-[80vh] overflow-auto flex flex-col-reverse'>
        <div className='space-y-2 flex flex-col-reverse'>
        <div ref={messagesEndRef} />
        {data?.pages.flatMap((group, i) => (
          <React.Fragment key={i}>
            {group.messages.map((message: Message, index: number) => (
              <div className='my-2' key={index}>
                <MessageItem message={message} />
              </div>
            ))}
          </React.Fragment>
        ))}
        <div ref={loadMoreRef} />
        <div className='h-16'/>
      </div>
      </div>
      <div className="w-full pt-2">
        <div className="grid w-full gap-2">
          <div className="w-full flex justify-between space-x-2 pt-2 items-center">
            <Input 
              className={`${input.length > 256 ? 'border-destructive' : ''} max-sm:h-12`}
              placeholder="Type your message here." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (e.shiftKey) {
                    e.preventDefault();
                    setTimeout(() => setInput(input + '\n'), 0);
                  } else {
                    // Send the message
                    e.preventDefault();
                    _sendMessage()
                  }
                }
              }}
            />
            <EmojiPicker input={input} setInput={setInput} />
          </div>
          { input.length > 256 ? (
              <p className="text-sm text-destructive">
                Message must be under 256 characters
              </p>
            ) : null}
          <MessageButton sendMessage={_sendMessage} disabled={input.length === 0 || write_isLoading}/>
        </div>
      </div>
    </main>
  )
}