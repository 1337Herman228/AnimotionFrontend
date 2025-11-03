import { useParams } from "next/navigation";
import { api } from "@/shared/api/axiosInstance";
import { IBoardProject } from "@/types";
import { websocketManager } from "@/shared/api/ws-manager";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useWebsocket = () => {
    const { data: session } = useSession();
    const params = useParams();
    const projectId = params?.projectId as string;

    useEffect(() => {
        console.log("WebSocket connecting...");
        const token = session?.user?.backendToken;
        if (!api || !projectId || !token) return;

        websocketManager.connect(token, projectId);

        return () => {
            websocketManager.disconnect();
        };
    }, [api, session, projectId]);
};

export default useWebsocket;
