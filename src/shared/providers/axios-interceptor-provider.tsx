"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "@/shared/api/axiosInstance";

export const AxiosInterceptorProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { data: session, status } = useSession();

    console.log("session", session, "status", status);

    useEffect(() => {
        const interceptor = api.interceptors.request.use(
            (config) => {
                if (session && !config.headers["Authorization"]) {
                    const token = session.user?.backendToken;
                    if (token) {
                        config.headers["Authorization"] = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => api.interceptors.request.eject(interceptor);
    }, [session]);

    return <>{children}</>;
};
