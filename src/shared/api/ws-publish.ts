import { Client } from "@stomp/stompjs";

const publish = (
    client: Client | null,
    destination: string,
    message: unknown
) => {
    if (client && client.active) {
        client.publish({
            destination,
            body: JSON.stringify(message),
        });
    } else {
        console.error(
            "Cannot send message, WebSocket client is not connected."
        );
    }
};

export default publish;
