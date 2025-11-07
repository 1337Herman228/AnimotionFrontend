import { Navbar } from "@/widgets/navbar";

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="p-1 max-w-[1200px] mx-auto mt-1 px-4 relative z-[100]">
                <Navbar />
            </div>
            {children}
        </>
    );
}
