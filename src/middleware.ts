import { type NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const user = cookieStore.get("Authorization");
  const headersList = headers();
  const fullUrl = headersList.get('referer');
  const { pathname } = new URL(request.url);

  const pathWithoutDomain = fullUrl ? new URL(fullUrl).pathname : '';

  if (
    !user &&
    !pathWithoutDomain.startsWith("/auth/") &&
    !pathname.startsWith("/auth/") &&
    !pathname.startsWith("/auth/") &&
    !pathname.startsWith("/api")
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url).toString());
  }
  return NextResponse.next();
}
