import { Client, IMessage } from "@stomp/stompjs";
import {
    ICardMessage,
    IBoardProject,
    IDeleteCardMessage,
    IMoveCardMessage,
    IMoveColumnMessage,
} from "@/types";

class WebSocketService {
    private client: Client | null = null;

    public connect(
        token: string,
        projectId: string,
        onUpdate: (update: IBoardProject) => void
    ) {
        if (this.client && this.client.active) {
            console.warn("WebSocket client is already connected.");
            return;
        }

        this.client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
        });

        this.client.onConnect = () => {
            const destination = `/topic/project/${projectId}`;
            this.client?.subscribe(destination, (message: IMessage) => {
                try {
                    const parsedData: IBoardProject = JSON.parse(message.body);
                    onUpdate(parsedData);
                } catch (error) {
                    console.error(
                        "Failed to parse WebSocket message body:",
                        error
                    );
                }
            });
        };

        this.client.onStompError = (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
        };

        this.client.activate();
    }

    public moveCard(message: IMoveCardMessage) {
        if (this.client && this.client.active) {
            this.client.publish({
                destination: "/app/board/move-card",
                body: JSON.stringify(message),
            });
        } else {
            console.error(
                "Cannot send message, WebSocket client is not connected."
            );
        }
    }

    public moveColumn(message: IMoveColumnMessage) {
        if (this.client && this.client.active) {
            this.client.publish({
                destination: "/app/board/move-column",
                body: JSON.stringify(message),
            });
        } else {
            console.error(
                "Cannot send message, WebSocket client is not connected."
            );
        }
    }

    public addCard(message: ICardMessage) {
        if (this.client && this.client.active) {
            this.client.publish({
                destination: "/app/board/add-card",
                body: JSON.stringify(message),
            });
        } else {
            console.error(
                "Cannot send message, WebSocket client is not connected."
            );
        }
    }

    public deleteCard(message: IDeleteCardMessage) {
        if (this.client && this.client.active) {
            this.client.publish({
                destination: "/app/board/delete-card",
                body: JSON.stringify(message),
            });
        } else {
            console.error(
                "Cannot send message, WebSocket client is not connected."
            );
        }
    }

    public editCard(message: ICardMessage) {
        if (this.client && this.client.active) {
            this.client.publish({
                destination: "/app/board/edit-card",
                body: JSON.stringify(message),
            });
        } else {
            console.error(
                "Cannot send message, WebSocket client is not connected."
            );
        }
    }

    public disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            console.log("WebSocket client disconnected.");
        }
    }
}

export const websocketService = new WebSocketService();
