import { Client, IMessage } from "@stomp/stompjs";
import { IBoardProject } from "@/types";

type PendingRequest = {
    resolve: (value: any) => void;
    reject: (reason?: unknown) => void;
    timeoutId: NodeJS.Timeout;
};

class WebSocketManager {
    private client: Client | null = null;
    private pendingRequests = new Map<string, PendingRequest>();

    private readonly REPLY_QUEUE = "/user/queue/replies";
    private readonly GENERAL_TOPIC_PREFIX = "/topic/project/";

    public connect(
        token: string,
        projectId: string,
        // Колбэк для общей рассылки (обновление доски)
        onGeneralUpdate: (update: IBoardProject) => void
    ): void {
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

            // 1. Подписка на общие обновления доски (рассылка)
            this.client?.subscribe(
                `${this.GENERAL_TOPIC_PREFIX}${projectId}`,
                (message: IMessage) => {
                    try {
                        const parsedData: IBoardProject = JSON.parse(
                            message.body
                        );
                        onGeneralUpdate(parsedData);
                    } catch (error) {
                        console.error("Failed to parse general update:", error);
                    }
                }
            );

            // 2. Подписка на персональную очередь для получения ответов (для useMutation)
            // Мы знаем, что сервер отправляет ответ сюда
            this.client?.subscribe(this.REPLY_QUEUE, this.handleReply);
        };

        // ... (onStompError и т.д.)
        this.client.onStompError = (frame) => {
            console.error("Broker reported error:", frame.headers["message"]);
            console.error("Additional details:", frame.body);
            this.disconnectPendingRequests("STOMP Error during connection.");
        };

        this.client.activate();
    }

    // Обработчик ответов из персональной очереди
    private handleReply = (message: IMessage) => {
        try {
            console.log("✅ --- PERSONAL REPLY RECEIVED! --- ✅");
            const response = JSON.parse(message.body);
            // Имена полей соответствуют вашему WebSocketReply.java
            const { correlationId, status, payload, error } = response;

            if (!correlationId || !this.pendingRequests.has(correlationId)) {
                return;
            }

            const pending = this.pendingRequests.get(correlationId)!;
            this.pendingRequests.delete(correlationId); // Удаляем, чтобы не вызвать дважды
            clearTimeout(pending.timeoutId);

            if (status === "SUCCESS") {
                // Если нужно вернуть что-то конкретное, используйте payload
                pending.resolve(payload);
            } else {
                pending.reject(new Error(error || "Unknown server error"));
            }
        } catch (e) {
            console.error("Failed to process reply message:", e);
        }
    };

    // Метод для отправки команд и ожидания ответа
    public publishAndAwaitReply<T>(
        destination: string,
        body: object,
        timeout = 3000
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!this.client || !this.client.active) {
                return reject(new Error("WebSocket is not connected."));
            }

            const correlationId = crypto.randomUUID();

            const timeoutId = setTimeout(() => {
                this.pendingRequests.delete(correlationId);
                reject(new Error(`Request timed out after ${timeout}ms`));
            }, timeout);

            this.pendingRequests.set(correlationId, {
                resolve,
                reject,
                timeoutId,
            });

            this.client.publish({
                destination,
                // Добавляем correlationId к исходящему сообщению
                body: JSON.stringify({ ...body, correlationId }),
            });
        });
    }

    private disconnectPendingRequests(reason: string) {
        this.pendingRequests.forEach((p) => {
            clearTimeout(p.timeoutId);
            p.reject(reason);
        });
        this.pendingRequests.clear();
    }

    public disconnect(): void {
        this.disconnectPendingRequests("Disconnecting WebSocket client.");
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            console.log("WebSocket client disconnected.");
        }
    }
}

export const websocketManager = new WebSocketManager();
