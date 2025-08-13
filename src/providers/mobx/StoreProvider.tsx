"use client";

import RootStore from "@/shared/stores/RootStore";
import { createContext, useContext, ReactNode } from "react";

const StoreContext = createContext<RootStore | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const store = new RootStore();

    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};

export const useStores = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStores must be used within a StoreProvider");
    }
    return context;
};
