import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const payloadCookie = req.cookies.get("payload-token");
    if ((!token || !payloadCookie) && req.nextUrl.pathname.startsWith("/me")) {
        // only redirect to login if user is not authenticated
        // and trying to access /me
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token && token.error) {
        const isProd = process.env.NODE_ENV === "production";
        const response = NextResponse.redirect(
            new URL(
                req.nextUrl.pathname.startsWith("/me") ? "/login" : "",
                req.url
            )
        );
        response.cookies.delete("payload-token");
        response.cookies.delete(
            `${isProd ? "__Secure-" : ""}next-auth.session-token`
        );
        response.cookies.delete(
            `${isProd ? "__Host-" : ""}next-auth.csrf-token`
        );
        response.cookies.delete(
            `${isProd ? "__Secure-" : ""}next-auth.callback-url`
        );
        response.cookies.delete("payload-token");
        return response;
    }
}
