"use client";
import { Button } from '@/shadcn-components/ui/button'
import { Icon } from '@iconify/react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn-components/ui/dropdown-menu"

export interface W3ButtonProps {
    isConnecting: boolean;
    isDisconnected: boolean;
    address: `0x${string}` | undefined;
}
export interface MessageButtonProps {
    sendMessage: () => void;
    disabled: boolean;
}
export interface NetworkButtonProps {
    isConnecting: boolean;
    isDisconnected: boolean;
}

export const W3Button = () => {
    const { open } = useWeb3Modal()
    const { address, isConnecting, isDisconnected } = useAccount()

    if (isConnecting || isDisconnected) {
      return (
        <Button onClick={() => open()} className="max-sm:h-11 max-sm:hidden">
          <Icon icon="simple-icons:walletconnect" className="mr-2 h-4 w-4"/> Connect
        </Button>
      )
    } else {
      const truncatedAddress = `${address!.slice(0, 5)}...${address!.slice(-5)}`;
      return (
        <Button onClick={() => open()} className="max-sm:h-11 max-sm:hidden">
          {truncatedAddress}
        </Button>
      )
    }
}
export const MessageButton = ({ sendMessage, disabled }: MessageButtonProps) => {
    const { isConnecting, isDisconnected } = useAccount()
    const { open } = useWeb3Modal()

    if ( isDisconnected || isConnecting ) {
      return (
        <Button onClick={() => open()} className="max-sm:h-11">
          <Icon icon="simple-icons:walletconnect" className="mr-2 h-4 w-4"/> Connect
        </Button>
      )
    } else {
      return (
        <Button disabled={disabled} onClick={sendMessage} className='max-sm:h-11'>
          Send message
        </Button>
      )
    }
}
export const NetworkButton = () => {
    const { open } = useWeb3Modal()
    const { isConnecting, isDisconnected } = useAccount()

    if (isConnecting || isDisconnected) {
      return (
        <Button variant="outline" size="icon" className="max-sm:h-11 max-sm:w-11">
          <Icon icon="lucide:settings" className="h-5 w-5"/>
        </Button>
      )
    } else {
      return (
        <Button variant="outline" size="icon" onClick={() => { console.log('gnomum'); open({ view: 'Networks' })}} className="max-sm:h-11 max-sm:w-11">
          <Icon icon="lucide:settings" className="h-5 w-5"/>
        </Button>
      )
    }
}

export const NavButton = () => {
  const pathname = usePathname();
  const isChatPage = pathname === '/chat';

  return (
    <Link href="/chat">
        <Button variant='link' className={`pl-0 ${isChatPage ? 'underline' : ''}`}>Chat 👋</Button>
    </Link>
  )
}

export const MobileMenu = () => {
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" className='sm:hidden'>Socials</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-24">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon icon='lucide:github' className="mr-2 h-4 w-4" />
              <span>Github</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon icon='lucide:twitter' className="mr-2 h-4 w-4" />
              <span>Twitter</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  
}