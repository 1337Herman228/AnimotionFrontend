import { withAuth } from "next-auth/middleware";

export default withAuth({
    // `withAuth` будет применять колбэки только к страницам,
    // которые соответствуют этому matcher.
    // Мы хотим защитить все, кроме страниц аутентификации.
    pages: {
        signIn: "/login", // Указываем нашу кастомную страницу логина
        // error: '/error', // Можно указать страницу для ошибок
    },
});

// Конфигурация для middleware: какие пути он должен обрабатывать.
export const config = {
    // Защищаем все пути, кроме статических файлов, API-роутов и страниц аутентификации.
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
    ],
};
