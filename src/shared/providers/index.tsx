"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { queryClient } from "../api/query-client";
import { AxiosInterceptorProvider } from "./axios-interceptor-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "../ui/sonner";

export const Providers = ({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session | null;
}) => {
    return (
        <SessionProvider
            session={session}
            refetchOnWindowFocus={false}
            refetchInterval={60 * 60} // 60 min
            refetchWhenOffline={false}
        >
            <QueryClientProvider client={queryClient}>
                <AxiosInterceptorProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </AxiosInterceptorProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
};
