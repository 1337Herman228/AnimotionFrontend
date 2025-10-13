import { cn } from "@/shared/utils/lib/cn";

const Section = ({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) => {
    return (
        <div
            {...props}
            className={cn("max-w-[1200px] mx-auto my-8 px-8", className)}
        >
            {children}
        </div>
    );
};

export default Section;
