import { Client } from "@stomp/stompjs";
import { TAddCardDtoSchema, TDeleteCardDtoSchema } from "./types";

class CardApiEndpoints {
    private client: Client | null = null;
    private readonly BASE_URL = "/app/board";

    public setClient(client: Client) {
        this.client = client;
    }

    public addCard(message: TAddCardDtoSchema) {
        if (this.client && this.client.active) {
            this.client.publish({
                destination: `${this.BASE_URL}/add-card`,
                body: JSON.stringify(message),
            });
        } else {
            console.error(
                "Cannot send message, WebSocket client is not connected."
            );
        }
    }

    public deleteCard(message: TDeleteCardDtoSchema) {
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
}

export const cardApiEndpoints = new CardApiEndpoints();
