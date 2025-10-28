import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0.03 * 60 * 1000, // 3 seconds
            gcTime: 60 * 60 * 1000,
        },
    },
});
