import { parse } from "valibot";
import { api } from "@/shared/api/axiosInstance";
import { boardApiEndpoints } from "./endpoints";
import { BoardSchema, BoardsSummarySchema } from "./contracts";

export const boardService = {
    async getAllBoards({ signal }: { signal?: AbortSignal }) {
        const response = await api.get(boardApiEndpoints.root, { signal });
        const parsedData = parse(BoardsSummarySchema, response.data);
        return parsedData;
    },

    async getBoardById({ id, signal }: { id: string; signal?: AbortSignal }) {
        const response = await api.get(boardApiEndpoints.byId(id), { signal });
        const parsedData = parse(BoardSchema, response.data);
        return parsedData;
    },

    // async addBoard(data: AddBoardDto) {
    //     const addBoardDto = parse(AddBoardDtoSchema, data);

    //     const response = await axiosInstance.post(
    //         boardApiEndpoints.root,
    //         addBoardDto
    //     );

    //     const parsedData = parse(BoardDtoSchema, response.data);

    //     return parsedData;
    // },

    // async editBoard(data: EditBoardDto) {
    //     const { boardId, ...editBoardDto } = parse(EditBoardDtoSchema, data);

    //     const response = await axiosInstance.patch(
    //         boardApiEndpoints.byId(boardId),
    //         editBoardDto
    //     );

    //     const parsedData = parse(BoardDtoSchema, response.data);

    //     return parsedData;
    // },

    // async deleteBoard(data: BoardIdDto) {
    //     const { boardId } = parse(BoardIdDtoSchema, data);

    //     await axiosInstance.delete(boardApiEndpoints.byId(boardId));
    // },
};
