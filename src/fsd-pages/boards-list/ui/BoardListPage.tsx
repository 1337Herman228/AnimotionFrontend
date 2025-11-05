import { boardQueries } from "@/entities/board";
import ScreenLoading from "@/shared/ui/screen-loading";
import Section from "@/shared/ui/section";
import { BoardSummaryList } from "@/widgets/board-list";
import { useQuery } from "@tanstack/react-query";

const BoardListPage = () => {
    const {
        data: boards,
        isPending,
        isError,
    } = useQuery({
        ...boardQueries.all(),
    });

    if (isPending || isError) {
        return <ScreenLoading />;
    }

    return (
        <Section>
            <h1 className="text-4xl font-semibold mb-8">My Projects</h1>
            <BoardSummaryList boards={boards} />
        </Section>
    );
};

export default BoardListPage;
