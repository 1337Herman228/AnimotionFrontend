import { queryOptions } from "@tanstack/react-query";
import { boardService } from "./service";

export const boardQueries = {
    all: () =>
        queryOptions({
            queryKey: ["projects"],
            queryFn: boardService.getAllBoards,
        }),
    byId: (id?: string | null) =>
        queryOptions({
            queryKey: ["projects", id],
            queryFn: () => boardService.getBoardById(id!),
            enabled: !!id,
        }),
};
