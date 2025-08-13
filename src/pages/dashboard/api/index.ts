"use client";

import { useStores } from "@/providers/mobx/StoreProvider";
import useAxios from "@/shared/hooks/useAxios";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const useDashboardPage = () => {
    const { data: session } = useSession();
    const { projectStore } = useStores();
    const axios = useAxios();

    useEffect(() => {
        if (!axios || !projectStore) return;
        projectStore.fetchProjects(axios, session);
    }, [projectStore, axios, session]);

    return { projectStore };
};

export default useDashboardPage;
