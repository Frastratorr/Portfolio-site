import { auth } from "@/auth";

// 👈 Функция теперь называется proxy, а не middleware
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isOnLogin = req.nextUrl.pathname.startsWith("/login");

  if (isOnAdmin && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }

  if (isOnLogin && isLoggedIn) {
    return Response.redirect(new URL("/admin", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};