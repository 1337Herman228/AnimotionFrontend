import { useDragAndDrop } from "@/features/drag-and-drop";
import { SortableContext } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { MemoizedColumn } from "./MemoizedColumn";

export const ColumnList = () => {
    const { columns } = useDragAndDrop();

    const columnsIds = useMemo(() => columns?.map((c) => c.id), [columns]);

    return (
        <SortableContext
            items={columnsIds || []}
            // strategy={horizontalListSortingStrategy}
        >
            <div className="desktop:pl-6 tablet:pl-8 flex gap-[34px] pl-5">
                {columns?.map((column) => (
                    <MemoizedColumn column={column} key={column.id} />
                ))}
                {/* <li>
                    <AddColumnDialog />
                </li> */}
            </div>
        </SortableContext>
    );
};
