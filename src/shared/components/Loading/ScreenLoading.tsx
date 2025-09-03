import { cn } from "@/lib/utils";
import Spinner from "../Spinner/Spinner";

interface ScreenLoadingProps {
    className?: string;
}

const ScreenLoading = ({ className, ...props }: ScreenLoadingProps) => {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center h-[100vh] w-[100vw] backdrop-blur-xs bg-accent/10">
            <Spinner className={cn("h-7 w-7", className)} {...props} />
        </div>
    );
};

export default ScreenLoading;
