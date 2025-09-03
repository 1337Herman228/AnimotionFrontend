"use client";

import useAxios from "@/shared/hooks/useAxios";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProjectsStore } from "@/shared/stores/projectsStore";

const useDashboardPage = () => {
    const { data: session } = useSession();
    const { projects, isFetching, error, fetchProjects } = useProjectsStore();
    const axios = useAxios();

    useEffect(() => {
        if (!axios || !fetchProjects) return;
        fetchProjects(axios, session);
    }, [fetchProjects, axios, session]);

    return { projects, isFetching, error };
};

export default useDashboardPage;
