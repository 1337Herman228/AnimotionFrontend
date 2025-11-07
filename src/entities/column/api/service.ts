import { TColumnService, TMoveColumnDtoSchema } from "./types";
import { parse } from "valibot";
import { MoveColumnDtoSchema } from "./contracts";
import { columnApiEndpoints } from "./endpoints";
import { api } from "@/shared/api/axiosInstance";

export const columnService: TColumnService = {
    // addColumn(data: TAddCardDtoSchema) {
    //     const addCardMessage = parse(AddCardDtoSchema, data);
    //     api.post(this.client, cardApiEndpoints.addCard(), addCardMessage);
    // },

    // deleteColumn(data: TDeleteCardDtoSchema) {
    //     const deleteCardMessage = parse(DeleteCardDtoSchema, data);
    //     api.delete(this.client, cardApiEndpoints.deleteCard(), deleteCardMessage);
    // },

    // editColumn(data: TEditCardDtoSchema) {
    //     const editCardMessage = parse(EditCardDtoSchema, data);
    //     api.pu(this.client, cardApiEndpoints.editCard(), editCardMessage);
    // },

    async moveColumn(data: TMoveColumnDtoSchema) {
        const moveColumnMessage = parse(MoveColumnDtoSchema, data);
        return api.put(columnApiEndpoints.moveColumn(), moveColumnMessage);
    },
};
