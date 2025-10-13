import Link from "next/link";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";
import SettingsMenu from "./SettingsMenu";
import UserAvatar from "@/entities/user-avatar/ui/UserAvatar";
import { IMember } from "@/types";

interface ProjectCardProps {
    project: {
        id: string;
        name: string;
        stats: {
            todo: number;
            inProgress: number;
            done: number;
        };
        members: IMember[];
    };
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
    const totalTasks =
        project.stats.todo + project.stats.inProgress + project.stats.done;
    const progressValue =
        totalTasks > 0 ? (project.stats.done / totalTasks) * 100 : 0;

    return (
        <Link href={`/projects/${project.id}`}>
            <Card className="hover:border-primary transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent-foreground/35 ">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                        {project.name}
                    </CardTitle>
                    <SettingsMenu />
                </CardHeader>

                <CardContent>
                    <Separator className="mb-4" />
                    <div className="flex justify-between text-sm text-muted-foreground mb-4">
                        <div className="text-center">
                            <p className="text-xl font-bold text-foreground">
                                {project.stats.todo}
                            </p>
                            <p>To Do</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-foreground">
                                {project.stats.inProgress}
                            </p>
                            <p>In Progress</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-foreground">
                                {project.stats.done}
                            </p>
                            <p>Done</p>
                        </div>
                    </div>
                    <Progress value={progressValue} className="w-full" />
                </CardContent>

                <CardFooter className="flex justify-between items-center gap-3">
                    <div className="flex -space-x-2 overflow-hidden">
                        {project.members.map((member, index) => (
                            <UserAvatar
                                src={member.image}
                                key={index}
                                className="h-8 w-8 border-0"
                            />
                        ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                        Updated 2 days ago
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
};

export default ProjectCard;
