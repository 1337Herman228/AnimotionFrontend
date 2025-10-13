"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/utils/lib/cn";
import {
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/shared/components/ui/navigation-menu";

export default function NavLink({
    href,
    children,
    className,
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
}) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <NavigationMenuItem>
            <NavigationMenuLink
                asChild
                data-active={isActive}
                className={cn(className, navigationMenuTriggerStyle())}
            >
                <Link href={href}>{children}</Link>
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
}
