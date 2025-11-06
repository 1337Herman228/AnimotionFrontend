import { websocketManager } from "@/shared/api/ws-manager";
import { TBoardSchema } from "@/entities/board/@x";
import { TColumnService, TMoveColumnDtoSchema } from "./types";
import { parse } from "valibot";
import { MoveColumnDtoSchema } from "./contracts";
import { columnApiEndpoints } from "./endpoints";

export const columnService: TColumnService = {
    client: null,

    // addColumn(data: TAddCardDtoSchema) {
    //     const addCardMessage = parse(AddCardDtoSchema, data);
    //     publish(this.client, cardApiEndpoints.addCard(), addCardMessage);
    // },

    // deleteColumn(data: TDeleteCardDtoSchema) {
    //     const deleteCardMessage = parse(DeleteCardDtoSchema, data);
    //     publish(this.client, cardApiEndpoints.deleteCard(), deleteCardMessage);
    // },

    // editColumn(data: TEditCardDtoSchema) {
    //     const editCardMessage = parse(EditCardDtoSchema, data);
    //     publish(this.client, cardApiEndpoints.editCard(), editCardMessage);
    // },

    async moveColumn(data: TMoveColumnDtoSchema) {
        const moveColumnMessage = parse(MoveColumnDtoSchema, data);
        return websocketManager.publishAndAwaitReply<TBoardSchema>(
            columnApiEndpoints.moveColumn(),
            moveColumnMessage
        );
    },
};
