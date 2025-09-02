"use client";

import { SessionProvider } from "next-auth/react";
import "./global.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/providers/mobx/StoreProvider";
import { NavigationMenuDemo } from "@/shared/components/Navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <SessionProvider
                    refetchOnWindowFocus={false}
                    refetchInterval={60 * 60} // update every 60 minutes
                    refetchWhenOffline={false}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <StoreProvider>{children}</StoreProvider>
                        <Toaster />
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
