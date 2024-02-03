import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async (req: NextRequestWithAuth) => {
        if (req.nextauth.token && req.nextauth.token.error) {
            const isProd = process.env.NODE_ENV === "production";
            const response = NextResponse.redirect(
                new URL(
                    req.url.includes(process.env.NEXTAUTH_URL + "/me")
                        ? "/login"
                        : "",
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
    },
    {
        callbacks: {
            authorized: async (req) => {
                // checks if user has token
                return !!req.token;
            },
        },
        // redirect list
        pages: {
            signIn: "/login",
            error: "/login",
            signOut: "/",
            newUser: "/register",
        },
    }
);

//checks /me path
export const config = {
    matcher: ["/me/:path*"],
};
