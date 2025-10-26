import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { websocketService } from "@/services/webSocketService";
import { useBoardStore } from "@/shared/stores/boardStore";
import { IBoardProject } from "@/types";
import { api } from "@/shared/api/axiosInstance";

export const useBoardLifecycle = () => {
    const { data: session } = useSession();
    const params = useParams();
    const projectId = params?.projectId as string;

    const { init, setBoardState } = useBoardStore();

    useEffect(() => {
        const token = session?.user?.backendToken;
        console.log("token", token);
        if (!api || !projectId || !token) return;

        init(api, projectId);

        const handleBoardUpdate = (updatedProject: IBoardProject) => {
            setBoardState(updatedProject);
        };

        websocketService.connect(token, projectId, handleBoardUpdate);

        return () => {
            websocketService.disconnect();
        };
    }, [api, session, projectId, init, setBoardState]);

    return { projectId };
};
