import {
    TAddCardDtoSchema,
    TCardService,
    TEditCardDtoSchema,
    TMoveCardDtoSchema,
} from "./types";
import { cardApiEndpoints } from "./endpoints";
import { parse } from "valibot";
import {
    AddCardDtoSchema,
    EditCardDtoSchema,
    MoveCardDtoSchema,
} from "./contracts";
import publish from "@/shared/api/ws-publish";
import { api } from "@/shared/api/axiosInstance";

export const cardService: TCardService = {
    client: null,

    moveCard(data: TMoveCardDtoSchema) {
        const moveCardMessage = parse(MoveCardDtoSchema, data);
        return api.put(cardApiEndpoints.moveCard(), moveCardMessage);
    },

    addCard(data: TAddCardDtoSchema) {
        const addCardMessage = parse(AddCardDtoSchema, data);
        return api.post(cardApiEndpoints.addCard(), addCardMessage);
    },

    deleteCard(id: string) {
        return api.delete(cardApiEndpoints.deleteCard(id));
    },

    editCard(data: TEditCardDtoSchema) {
        const editCardMessage = parse(EditCardDtoSchema, data);
        return api.put(cardApiEndpoints.editCard(), editCardMessage);
    },
};
