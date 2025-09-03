import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreateNewCardBtnProps {
    addCard: () => void;
}

const CreateNewCardBtn = ({ addCard }: CreateNewCardBtnProps) => {
    return (
        <Button
            onClick={addCard}
            variant={"ghost"}
            className="cursor-pointer w-full hover:bg-accent-foreground/10 dark:hover:bg-accent-foreground/10 transition-all duration-300 justify-start"
        >
            <div className="flex place-items-center gap-1.5">
                <Plus strokeWidth={2} size={20} className="size-5" />
                <span className="">Create New Card</span>
            </div>
        </Button>
    );
};

export default CreateNewCardBtn;
