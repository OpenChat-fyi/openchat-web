import ChatMain from './chat-main';
import axios from 'axios';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
  } from '@tanstack/react-query'
  
export default async function RouteHandler() {
    const queryClient = new QueryClient()

    const fetchMessages = async ({ pageParam }: { pageParam: number }) => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/message?page=${pageParam}`);
        return { messages: response.data, nextCursor: response.data.length ? response.data.length === 50 ? pageParam + 1 : undefined : undefined };
      };

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['messages'],
        queryFn: fetchMessages,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
        pages: 3, // prefetch the first 3 pages
      })
    
    // await queryClient.prefetchQuery({
    //     queryKey: ['messages'],
    //     queryFn: async () => {
    //         const pageParam = 1
    //         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/message?page=${pageParam}`);
    //         return { messages: response.data, nextCursor: response.data.length === 50 ? pageParam + 1 : undefined };
    //       },
    //   })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ChatMain />
        </HydrationBoundary>
    )
}