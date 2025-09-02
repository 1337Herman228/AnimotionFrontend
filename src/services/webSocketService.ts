import { Client, IMessage } from "@stomp/stompjs";
import { IBoardProject, ICard } from "@/types";

interface MoveCardMessage {
    projectId: string;
    sourceColumn: {
        id: string;
        cardOrder: string[];
    };
    destinationColumn: {
        id: string;
        cardOrder: string[];
    };
    card: ICard;
}

interface MoveColumnMessage {
    projectId: string;
    columnOrder: string[];
}

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
        // Если клиент уже активен, ничего не делаем, чтобы избежать дублирования соединений.
        if (this.client && this.client.active) {
            console.warn("WebSocket client is already connected.");
            return;
        }

        this.client = new Client({
            brokerURL: "ws://localhost:8080/ws",

            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },

            // Включаем подробное логирование для отладки
            debug: (str) => {
                console.log(new Date(), "STOMP: " + str);
            },

            // Пытаться переподключиться каждые 5 секунд в случае разрыва
            reconnectDelay: 5000,
        });

        // Что делать после успешного подключения
        this.client.onConnect = (frame) => {
            const destination = `/topic/project/${projectId}`;
            this.client?.subscribe(destination, (message: IMessage) => {
                try {
                    const updatedProjectState: IBoardProject = JSON.parse(
                        message.body
                    );
                    // Вызываем переданный колбэк с новыми данными
                    onUpdate(updatedProjectState);
                } catch (error) {
                    console.error(
                        "Failed to parse WebSocket message body:",
                        error
                    );
                }
            });
        };

        // Что делать при ошибке STOMP (например, нет прав на подписку)
        this.client.onStompError = (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
        };

        // Активируем клиент для установки соединения
        this.client.activate();
    }

    /**
     * Отправляет на сервер команду перемещения карточки.
     * @param message Объект с данными для перемещения.
     */
    public moveCard(message: MoveCardMessage) {
        if (this.client && this.client.active) {
            this.client.publish({
                destination: "/app/board/move-card",
                body: JSON.stringify(message),
            });
            // console.log("Sent move-card message:", message);
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
    public moveColumn(message: MoveColumnMessage) {
        if (this.client && this.client.active) {
            this.client.publish({
                // Важно: Убедитесь, что на бэкенде есть контроллер, слушающий этот эндпоинт
                destination: "/app/project/move-column",
                body: JSON.stringify(message),
            });
            console.log("Sent move-column message:", message);
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
