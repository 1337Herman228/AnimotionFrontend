import { Client, IMessage } from "@stomp/stompjs";
import {
    ICardMessage,
    IBoardProject,
    ICard,
    IDeleteCardMessage,
    IMoveCardMessage,
    IMoveColumnMessage,
} from "@/types";

class WebSocketService {
    private client: Client | null = null;

    /**
     * Устанавливает соединение с WebSocket-сервером и подписывается на обновления проекта.
     * @param token JWT для аутентификации.
     * @param projectId ID проекта для подписки.
     * @param onUpdate Колбэк-функция, которая будет вызываться при получении обновления.
     */
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

        this.client.onConnect = (frame) => {
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

    /**
     * Отправляет на сервер команду перемещения карточки.
     * @param message Объект с данными для перемещения.
     */
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

    /**
     * Отправляет на сервер команду изменения порядка колонок.
     * @param message Объект с новым порядком колонок.
     */
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

    /**
     * Закрывает WebSocket-соединение.
     */
    public disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            console.log("WebSocket client disconnected.");
        }
    }
}

// Экспортируем один-единственный экземпляр сервиса (Singleton pattern)
export const websocketService = new WebSocketService();
