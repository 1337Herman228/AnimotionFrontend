import { ComponentProps, createContext, use, useMemo } from "react";

type CardInfoDialogContext = {
    card: string;
};

const CardInfoDialogContext = createContext<CardInfoDialogContext | undefined>(
    undefined
);

const useCardInfoDialogContext = () => {
    const context = use(CardInfoDialogContext);

    if (!context) {
        throw new Error(
            "useCardInfoDialogContext must be used with a CardInfoDialogContext.Provider"
        );
    }

    return context;
};

type CardInfoDialogProviderProps = CardInfoDialogContext &
    ComponentProps<"div">;

const CardInfoDialogProvider = ({
    card,
    className,
    children,
    ...props
}: CardInfoDialogProviderProps) => {
    const value = useMemo(() => ({ card }), [card]);

    return (
        <CardInfoDialogContext value={value}>{children}</CardInfoDialogContext>
    );
};
