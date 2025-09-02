"use client";

import { NavigationMenuDemo } from "@/shared/components/Navbar";

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="p-1 max-w-[1200px] mx-auto mt-1 px-4">
                <NavigationMenuDemo />
            </div>
            {children}
        </>
    );
}
