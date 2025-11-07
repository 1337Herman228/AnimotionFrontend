import { getServerSession } from "next-auth";
import { Providers } from "@/shared/providers";
import { authOptions } from "./api/auth/[...nextauth]/options";
import "./global.css";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers session={session}>{children}</Providers>
            </body>
        </html>
    );
}
