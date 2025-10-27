import { parse } from "valibot";
import { api } from "@/shared/api/axiosInstance";
import { boardApiEndpoints } from "./endpoints";
import { BoardProjectSchema, ProjectSummarySchema } from "./contracts";

export const boardService = {
    async getAllBoards() {
        const response = await api.get(boardApiEndpoints.root);
        const parsedData = parse(ProjectSummarySchema, response.data);
        return parsedData;
    },

    async getBoardById(id: string) {
        const response = await api.get(boardApiEndpoints.byId(id));
        const parsedData = parse(BoardProjectSchema, response.data);
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
