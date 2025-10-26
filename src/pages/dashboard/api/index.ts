"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProjectsStore } from "@/shared/stores/projectsStore";
import { api } from "@/shared/api/axiosInstance";

const useDashboardPage = () => {
    const { data: session } = useSession();
    const { projects, isFetching, isLoading, error, fetchProjects } =
        useProjectsStore();

    useEffect(() => {
        if (!api || !fetchProjects) return;
        fetchProjects(api, session);
    }, [fetchProjects, api, session]);

    return { projects, isFetching, isLoading, error };
};

export default useDashboardPage;
