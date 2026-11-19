import { auth } from "./auth"; // 👈 Убедитесь, что путь правильный (если auth.ts в корне)
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");

  // Если не залогинен и пытается зайти в админку — редирект на логин
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  // В остальных случаях пропускаем
  return NextResponse.next();
});

// Обязательно указываем matcher, чтобы proxy не блокировал картинки и API
export const config = {
  matcher: ["/admin/:path*"],
};