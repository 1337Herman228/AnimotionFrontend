import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function timeAgo(date: Date | string) {
    const seconds = dayjs().diff(date, "second");
    if (seconds < 60) return "Just now";

    const minutes = dayjs().diff(date, "minute");
    if (minutes < 60) return `${minutes}m ago`;

    const hours = dayjs().diff(date, "hour");
    if (hours < 24) return `${hours}h ago`;

    const days = dayjs().diff(date, "day");
    return `${days}d ago`;
}
