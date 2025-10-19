import {
    TAddCardDtoSchema,
    TcardService,
    TDeleteCardDtoSchema,
    TEditCardDtoSchema,
    TMoveCardDtoSchema,
} from "./types";
import { cardApiEndpoints } from "./endpoints";
import { parse } from "valibot";
import {
    AddCardDtoSchema,
    DeleteCardDtoSchema,
    EditCardDtoSchema,
    MoveCardDtoSchema,
} from "./contracts";
import publish from "@/shared/api/ws-publish";
import { websocketManager } from "@/shared/api/ws-manager";
import { TBoardProjectSchema } from "@/entities/board/@x/card";

export const cardService: TcardService = {
    client: null,

    addCard(data: TAddCardDtoSchema) {
        const addCardMessage = parse(AddCardDtoSchema, data);
        publish(this.client, cardApiEndpoints.addCard(), addCardMessage);
    },

    deleteCard(data: TDeleteCardDtoSchema) {
        const deleteCardMessage = parse(DeleteCardDtoSchema, data);
        publish(this.client, cardApiEndpoints.deleteCard(), deleteCardMessage);
    },

    editCard(data: TEditCardDtoSchema) {
        const editCardMessage = parse(EditCardDtoSchema, data);
        publish(this.client, cardApiEndpoints.editCard(), editCardMessage);
    },

    async moveCard(data: TMoveCardDtoSchema) {
        const moveCardMessage = parse(MoveCardDtoSchema, data);
        return websocketManager.publishAndAwaitReply<TBoardProjectSchema>(
            cardApiEndpoints.moveCard(),
            moveCardMessage
        );
    },
};
