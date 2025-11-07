import { Client, IMessage } from "@stomp/stompjs";
import { queryClient } from "./query-client";
import { boardQueries, BoardTypes } from "@/entities/board";

class WebSocketManager {
    private client: Client | null = null;

    private readonly GENERAL_TOPIC_PREFIX = "/topic/project/";

    public connect(token: string, projectId: string): void {
        if (this.client && this.client.active) {
            console.warn("WebSocket client is already connected.");
            return;
        }

        this.client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
        });

        this.client.onConnect = () => {
            console.log("WebSocket client connected.");
            this.client?.subscribe(
                `${this.GENERAL_TOPIC_PREFIX}${projectId}`,
                (message: IMessage) => {
                    try {
                        const parsedData: BoardTypes.TBoardSchema = JSON.parse(
                            message.body
                        );
                        queryClient.setQueryData<BoardTypes.TBoardSchema>(
                            boardQueries.getIdKey(projectId),
                            () => parsedData
                        );
                    } catch (error) {
                        console.error("Failed to parse general update:", error);
                    }
                }
            );
        };

        this.client.onStompError = (frame) => {
            console.error("Broker reported error:", frame.headers["message"]);
            console.error("Additional details:", frame.body);
        };

        this.client.activate();
    }

    public publishAndAwaitReply<T>(
        destination: string,
        body: object
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!this.client || !this.client.active) {
                return reject(new Error("WebSocket is not connected."));
            }

            this.client.publish({
                destination,
                body: JSON.stringify({
                    ...body,
                }),
            });
        });
    }

    public disconnect(): void {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            console.log("WebSocket client disconnected.");
        }
    }
}

export const websocketManager = new WebSocketManager();
