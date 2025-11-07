import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login", // Указываем нашу кастомную страницу логина
        // error: '/error', // Можно указать страницу для ошибок
    },
});

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
    ],
};
