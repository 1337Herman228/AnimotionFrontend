import { create } from "zustand";
import { IProject } from "@/types";
import { AxiosInstance } from "axios";
import { Session } from "next-auth";

interface ProjectsState {
    projects: IProject[];
    isFetching: boolean;
    isLoading: boolean;
    error: Error | null;

    fetchProjects: (
        axios: AxiosInstance,
        session: Session | null
    ) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
    projects: [],
    isLoading: true,
    isFetching: false,
    error: null,

    fetchProjects: async (axios: AxiosInstance, session: Session | null) => {
        if (!session) return;
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get<IProject[]>("/projects");
            set({ projects: response.data });
        } catch (err: any) {
            console.error("Failed to fetch projects:", err);
            set({ error: err });
        } finally {
            set({ isLoading: false });
        }
    },
}));
