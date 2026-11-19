import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const adminUser = process.env.ADMIN_USER;
        const adminPass = process.env.ADMIN_PASSWORD;

        if (
          credentials?.username === adminUser && 
          credentials?.password === adminPass
        ) {
          // Возвращаем объект пользователя, если пароль верный
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }
        
        // Если пароль неверный — возвращаем null
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login", // Перенаправлять на нашу страницу входа
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      
      // Защищаем только админку
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Перенаправит на страницу входа
      }
      return true;
    },
  },
})