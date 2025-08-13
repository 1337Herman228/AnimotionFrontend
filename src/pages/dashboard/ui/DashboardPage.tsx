import useDashboardPage from "../api";
import Section from "@/shared/components/Section/Section";
import { observer } from "mobx-react-lite";
import ProjectCard from "./ProjectCard";

const DashboardPage = () => {
    const { projectStore } = useDashboardPage();

    if (projectStore?.isFetching) {
        return <div>Loading projects...</div>;
    }

    return (
        <Section>
            <h1 className="text-4xl font-semibold mb-8">My Projects</h1>
            <ul className="grid grid-cols-2 gap-4">
                {projectStore.projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={{
                            ...project,
                            stats: {
                                todo: 1,
                                inProgress: 2,
                                done: 1,
                            },
                            members: [
                                {
                                    image: "https://example.com/avatar1.jpg",
                                    fallback: "ABC",
                                },
                                {
                                    image: "https://example.com/avatar1.jpg",
                                    fallback: "A",
                                },
                                {
                                    image: "https://example.com/avatar1.jpg",
                                    fallback: "A",
                                },
                            ],
                        }}
                    />
                ))}
            </ul>
        </Section>
    );
};

export default observer(DashboardPage);
