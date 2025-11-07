interface IBoardColumn {
    cardOrder: string[];
    cards: any;
    id: string;
    title: string;
}

export const findColumnByCardId = (
    cardId: string,
    columns: IBoardColumn[] | null
) => {
    if (!columns) return null;
    return columns?.find((col) => col.cardOrder.includes(cardId));
};

export const updateColumns = (
    columns: IBoardColumn[],
    updated: IBoardColumn | IBoardColumn[]
) => {
    const arr = Array.isArray(updated) ? updated : [updated];
    if (arr?.length === 0) return columns;

    const byId = new Map(arr.map((c) => [c.id, c]));
    return columns.map((c) => byId.get(c.id) ?? c);
};
