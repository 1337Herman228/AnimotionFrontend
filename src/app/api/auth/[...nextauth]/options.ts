import { api } from "@/shared/axios/api";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            // This func calls when signIn() is working
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const response = await api.post("/auth/login", {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const data = response.data;

                    if (data) {
                        return {
                            ...data.user,
                            backendToken: data.token,
                        };
                    }

                    return null;
                } catch (error: any) {
                    console.error("Login error", error.response?.data);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        // Этот колбэк вызывается при создании JWT.
        // Объект `user` доступен только при первом входе.
        async jwt({ token, user }) {
            // Если `user` существует, значит это первый вход
            if (user) {
                // Мы передаем токен от бэкенда в JWT NextAuth
                token.backendToken = (user as any).backendToken;
                token.id = (user as any).id;
            }
            return token;
        },

        // Этот колбэк вызывается при запросе сессии (например, через useSession)
        async session({ session, token }) {
            // Мы передаем данные из JWT NextAuth в объект сессии,
            // который будет доступен на клиенте.
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.backendToken = token.backendToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: parseInt(process.env.JWT_EXPIRATION_SECONDS || "86400", 10),
    },
    secret: process.env.NEXTAUTH_SECRET,
};
