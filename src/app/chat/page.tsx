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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/message?page=${pageParam}`, {
          headers: {
            "ngrok-skip-browser-warning": "69420"
          }
        });
        return { messages: response.data, nextCursor: response.data.length ? response.data.length === 50 ? pageParam + 1 : undefined : undefined };
      };

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['messages'],
        queryFn: fetchMessages,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
        pages: 3, // prefetch the first 3 pages
      })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ChatMain />
        </HydrationBoundary>
    )
}