import { useParams } from "next/navigation";
import { api } from "@/shared/api/axiosInstance";
import { websocketManager } from "@/shared/api/ws-manager";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useWebsocket = () => {
    const { data: session } = useSession();
    const params = useParams();
    const boardId = params?.boardId as string;

    useEffect(() => {
        console.log("WebSocket connecting...");
        const token = session?.user?.backendToken;
        if (!api || !boardId || !token) return;

        websocketManager.connect(token, boardId);

        return () => {
            websocketManager.disconnect();
        };
    }, [api, session, boardId]);
};

export default useWebsocket;
