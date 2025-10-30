import { queryOptions } from "@tanstack/react-query";
import { boardService } from "./service";

export const boardQueries = {
    all: () =>
        queryOptions({
            queryKey: ["board"],
            queryFn: boardService.getAllBoards,
        }),
    byId: (id?: string | null) =>
        queryOptions({
            queryKey: ["board", id],
            queryFn: () => boardService.getBoardById(id!),
            enabled: !!id,
        }),
};
