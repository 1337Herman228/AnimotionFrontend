import { DefaultSession } from "next-auth";

// Extending base interface Session
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            backendToken: string;
        } & DefaultSession["user"];
    }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
    interface JWT {
        backendToken?: string;
    }
}
