import useDashboardPage from "../api";
import Section from "@/shared/components/Section/Section";
import ProjectCard from "./ProjectCard";
import ScreenLoading from "@/shared/components/Loading/ScreenLoading";

const DashboardPage = () => {
    const { projects, isLoading, error } = useDashboardPage();

    if (isLoading) {
        return <ScreenLoading />;
    }

    return (
        <Section>
            <h1 className="text-4xl font-semibold mb-8">My Projects</h1>
            <ul className="grid grid-cols-2 gap-4">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={{
                            ...project,
                            stats: {
                                todo: 1,
                                inProgress: 2,
                                done: 1,
                            },
                        }}
                    />
                ))}
            </ul>
        </Section>
    );
};

export default DashboardPage;
