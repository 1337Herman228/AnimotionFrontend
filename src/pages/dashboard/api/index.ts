"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProjectsStore } from "@/shared/stores/projectsStore";
import { useAxios } from "@/shared/api";

const useDashboardPage = () => {
  const { data: session } = useSession();
  const { projects, isFetching, isLoading, error, fetchProjects } =
    useProjectsStore();
  const axios = useAxios();

  useEffect(() => {
    if (!axios || !fetchProjects) return;
    fetchProjects(axios, session);
  }, [fetchProjects, axios, session]);

  return { projects, isFetching, isLoading, error };
};

export default useDashboardPage;
