import { IProject } from "@/types";
import { AxiosInstance } from "axios";
import { makeAutoObservable } from "mobx";
import { Session } from "next-auth";

class ProjectStore {
    projects: IProject[] = [];
    isFetching = true;
    error: Error | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    fetchProjects = async (axios: AxiosInstance, session: Session | null) => {
        if (!session) return;
        this.isFetching = true;
        try {
            const response = await axios.get("/projects");
            this.projects = response.data;
        } catch (err: any) {
            this.error = err;
            console.error("Failed to fetch projects:", err);
        } finally {
            this.isFetching = false;
        }
    };
}

export default ProjectStore;
