import cmsRequest from "@/utils/fetchUtils";
import NextAuth from "next-auth";
import type { AuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies as nextCookies } from "next/headers";
import cookie from "cookie";
import { AuthErrors } from "@/index.d";

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
                            for (const c of cookies) {
                                if (c.includes("payload-token")) {
                                    const parsedCookie = cookie.parse(c);
                                    // get expire and return it as timestamp
                                    const { "payload-token": value, ...rest } =
                                        parsedCookie;
                                    nextCookies().set(
                                        "payload-token",
                                        value,
                                        rest
                                    );
                                }
                            }
                        }
                        const { email, id, createdAt } = user.user;
                        // user.exp is in seconds, convert to ms by * 1000
                        console.log(user);
                        return {
                            email,
                            id,
                            createdAt,
                            authToken: user.token,
                            expires: user.exp * 1000,
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
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ token, user }: { token: JWT; user?: User }) => {
            if (token && token.authToken && token.expires) {
                try {
                    console.log("sending refresh req", token.authToken);
                    const res = await cmsRequest({
                        path: "/api/public-users/refresh-token",
                        method: "POST",
                        headers: {
                            // Authorization: `Bearer ${token.authToken}`,
                        },
                        body: {
                            // token: token.authToken,
                        },
                    });

                    const refreshedUser = await res.json();
                    console.log("refreshed:", refreshedUser);
                    if (refreshedUser.user) {
                        const { email, id, createdAt } = refreshedUser;
                        return {
                            ...{
                                ...token,
                                email,
                                id,
                                createdAt,
                                authToken: refreshedUser.refreshedToken,
                                expires: refreshedUser.exp * 1000,
                            },
                            ...user,
                        };
                    } else {
                        // user cookie is not valid anymore
                        return {
                            ...token,
                            user,
                            error: AuthErrors.INVALID_SESSION,
                        };
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            return { ...token, ...user };
        },
        session: async ({
            session,
            token: _token,
        }: {
            session: any;
            token: JWT;
        }) => {
            // remove token and expiration from session
            const { authToken, expires, ...rest } = _token;
            session.user = rest;
            return session;
        },
        redirect: async ({
            url,
            baseUrl,
        }: {
            url: string;
            baseUrl: string;
        }) => {
            // decode URLs
            url = decodeURIComponent(url);
            baseUrl = decodeURIComponent(baseUrl);

            // get callbackUrl parameter
            if (url.includes("callbackUrl=")) {
                const urlAfterCallbackParam = url.split("callbackUrl=")[1];
                if (urlAfterCallbackParam) {
                    if (urlAfterCallbackParam.includes("&")) {
                        const callbackUrl = urlAfterCallbackParam.split("&")[0];
                        if (callbackUrl) {
                            return callbackUrl;
                        }
                    }
                    return urlAfterCallbackParam;
                }
            }

            return baseUrl + "/me";
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
        signOut: "/",
    },
    events: {
        signOut: async ({ session, token }) => {},
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
