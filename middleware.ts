import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login"];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    const token =
        request.cookies.get("access_token")?.value;

    const isPublic =
        PUBLIC_ROUTES.includes(pathname);

    if (!token && !isPublic) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    if (token && pathname === "/login") {
        return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/branches/:path*",
        "/leads/:path*",
        "/users/:path*",
        "/roles/:path*",
        "/universities/:path*",
        "/applications/:path*",
        "/student-profiles/:path*",
        "/master-settings/:path*",
        "/mbbs-leads/:path*",
    ],
};