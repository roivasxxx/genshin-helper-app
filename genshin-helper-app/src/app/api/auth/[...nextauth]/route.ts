import cmsRequest from "@/utils/fetchUtils";
import NextAuth from "next-auth";
import type { AuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies as nextCookies } from "next/headers";
import cookie from "cookie";
import { AuthErrors } from "@/index.d";

const setPayloadCookie = (resCookies: string[]) => {
    for (const c of resCookies) {
        if (c.includes("payload-token")) {
            const parsedCookie = cookie.parse(c);
            // get expire and return it as timestamp
            const { "payload-token": value, ...rest } = parsedCookie;
            nextCookies().set("payload-token", value, {
                ...rest,
                httpOnly: true,
                secure: true,
                expires: new Date(rest["Expires"]),
            });
        }
    }
    return null;
};

const authOptions: AuthOptions = {
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
                            setPayloadCookie(cookies);
                        }
                        const { email, id, createdAt } = user.user;
                        // user.exp is in seconds, convert to ms by * 1000
                        return {
                            email,
                            id,
                            createdAt,
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
    callbacks: {
        jwt: async ({ token, user }: { token: JWT; user?: User }) => {
            const payloadToken = nextCookies().get("payload-token");
            if (payloadToken) {
                try {
                    const res = await cmsRequest({
                        path: "/api/public-users/refresh-token",
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${payloadToken.value}`,
                        },
                        body: {
                            token: payloadToken.value,
                        },
                    });

                    const refreshedUser = await res.json();
                    const cookies = res.headers.getSetCookie();
                    if (refreshedUser.user) {
                        if (cookies) {
                            setPayloadCookie(cookies);
                        }
                        const { email, id, createdAt } = refreshedUser.user;
                        return {
                            ...{
                                ...token,
                                email,
                                id,
                                createdAt,
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
        session: async ({ session, token }: { session: any; token: JWT }) => {
            const { email, id, createdAt } = token;
            // need to destructure token, because it keeps returning the tokens jti, iat, exp and sub
            session.user = { email, id, createdAt };
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

            return baseUrl;
        },
    },
    pages: {
        signIn: "/login",
        newUser: "/register",
        error: "/login",
        signOut: "/",
    },
    events: {
        signOut: async ({ session, token }) => {
            // manually remove payload cookie because next-auth doesnt do it for some reason
            console.log("signign the user out!");
            nextCookies().delete("payload-token");
        },
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
