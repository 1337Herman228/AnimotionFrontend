import { queryOptions } from "@tanstack/react-query";
import { boardService } from "./service";

export const boardQueries = {
    getIdKey: (id: string) => ["board", id],
    all: () =>
        queryOptions({
            queryKey: ["board"],
            queryFn: ({ signal }) => boardService.getAllBoards({ signal }),
        }),

    byId: (id?: string | null) =>
        queryOptions({
            queryKey: ["board", id],
            queryFn: ({ signal }) =>
                boardService.getBoardById({ id: id!, signal }),
            enabled: !!id,
        }),
};
