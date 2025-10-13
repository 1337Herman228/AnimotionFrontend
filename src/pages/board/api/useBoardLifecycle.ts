import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import useAxios from "@/shared/hooks/lib/useAxios";
import { websocketService } from "@/services/webSocketService";
import { useBoardStore } from "@/shared/stores/boardStore";
import { IBoardProject } from "@/types";

export const useBoardLifecycle = () => {
    const { data: session } = useSession();
    const axios = useAxios();
    const params = useParams();
    const projectId = params?.projectId as string;

    const { init, setBoardState } = useBoardStore();

    useEffect(() => {
        const token = session?.user?.backendToken;
        if (!axios || !projectId || !token) return;

        init(axios, projectId);

        const handleBoardUpdate = (updatedProject: IBoardProject) => {
            setBoardState(updatedProject);
        };

        websocketService.connect(token, projectId, handleBoardUpdate);

        return () => {
            websocketService.disconnect();
        };
    }, [axios, session, projectId, init, setBoardState]);

    return { projectId };
};
