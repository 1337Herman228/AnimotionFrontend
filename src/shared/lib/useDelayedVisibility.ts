import { useEffect, useState } from "react";

export function useDelayedVisibility(
    active: boolean,
    delay: number = 300
): boolean {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;

        if (active) {
            timer = setTimeout(() => setVisible(true), delay);
        } else {
            setVisible(false);
            clearTimeout(timer);
        }

        return () => clearTimeout(timer);
    }, [active, delay]);

    return visible;
}
