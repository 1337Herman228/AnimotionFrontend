import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "../../axios/api";

const useAxios = () => {
    const { data: session } = useSession();

    useEffect(() => {
        // This is the function that will run before each request
        const requestIntercept = api.interceptors.request.use(
            (config) => {
                // If the authorization header isn't already set, set it.
                if (!config.headers["Authorization"]) {
                    const token = (session?.user as any)?.backendToken;

                    if (token) {
                        config.headers["Authorization"] = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // This is the cleanup function that will run when the component unmounts
        // or when the session changes.
        return () => {
            api.interceptors.request.eject(requestIntercept);
        };
    }, [session]); // The effect depends on the session object

    return api; // Return the configured axios instance
};

export default useAxios;
