import cmsRequest from "@/utils/fetchUtils";
import NextAuth from "next-auth";
import type { AuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies as nextCookies } from "next/headers";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (typeof credentials !== "undefined") {
                    try {
                        const res = await cmsRequest({
                            path: "/api/public-users/login",
                            method: "POST",
                            body: credentials,
                        });
                        const user = await res.json();
                        const cookies = res.headers.getSetCookie();
                        if (cookies) {
                            for (const cookie of cookies) {
                                if (cookie.includes("payload-token")) {
                                    nextCookies().set("payload-token", cookie);
                                }
                            }
                        }
                        const { email, id, createdAt } = user.user;
                        return {
                            email,
                            id,
                            createdAt,
                            token: { value: user.token, expires: user.exp },
                        };
                    } catch (error) {
                        return null;
                    }
                } else {
                    return null;
                }
            },
        }),
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ token, user }: { token: JWT; user?: User }) => {
            return { ...token, ...user };
        },
        session: async ({
            session,
            token: _token,
        }: {
            session: any;
            token: JWT;
        }) => {
            // remove token from session
            const { token, ...rest } = _token;
            session.user = rest;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
