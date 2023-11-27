// components/Navbar.tsx
"use client"
import dynamic from 'next/dynamic'
import React from 'react';
import { Button } from '@/shadcn-components/ui/button';
import { Card, CardContent } from '@/shadcn-components/ui/card'

import { Separator } from '@/shadcn-components/ui/separator';
import Link from 'next/link';
const NetworkButton = dynamic(() => import('@/components/buttons').then((mod) => mod.NetworkButton), { ssr: false })
const W3Button = dynamic(() => import('@/components/buttons').then((mod) => mod.W3Button), { ssr: false });
const MobileMenu = dynamic(() => import('@/components/buttons').then((mod) => mod.MobileMenu))
const NavButton = dynamic(() => import('@/components/buttons').then((mod) => mod.NavButton), { ssr: false })

const Navbar = () => {
  return (
    <div className="w-full fixed top-0 left-0 justify-center items-center px-3 md:px-64 my-8 h-16 z-50">
        <Card className='h-full flex items-center  bg-white bg-opacity-50 backdrop-blur-md'>
            <CardContent className='w-full items-center flex py-0'>
                <div className="flex justify-between items-center w-full">
                    <div className='w-auto flex justify-start items-center'>
                        <Link href="/">
                            <p className='text-lg font-bold'>OpenChat</p>
                        </Link>
                        <Separator orientation='vertical' className='h-10 mx-6' />
                        <NavButton />
                        <Button variant='link' className='max-md:hidden'>Github</Button>
                        <Button variant='link' className='max-md:hidden'>Twitter</Button>
                        <MobileMenu />
                    </div>
                    <div className="flex justify-end space-x-2 max-md:hidden">
                        <W3Button />
                        <NetworkButton />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default Navbar;