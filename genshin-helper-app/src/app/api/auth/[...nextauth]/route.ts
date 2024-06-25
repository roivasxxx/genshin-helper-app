import cmsRequest, { HttpError } from "@/utils/fetchUtils";
import NextAuth from "next-auth";
import type { AuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies as nextCookies } from "next/headers";
import cookie from "cookie";
import { AUTH_ERRORS, HTTP_METHOD } from "@/types";

const setPayloadCookie = (resCookies: string[]) => {
    for (const c of resCookies) {
        if (c.includes("payload-token")) {
            const parsedCookie = cookie.parse(c);
            const { "payload-token": value, ...rest } = parsedCookie;
            nextCookies().set("payload-token", value, {
                ...rest,
                httpOnly: true,
                secure: true,
                expires: new Date(rest["Expires"]),
                domain: `.${process.env.ROOT_DOMAIN}`,
            });
            return true;
        }
    }
    return false;
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
                if (credentials && credentials.email && credentials.password) {
                    try {
                        const res = await cmsRequest({
                            path: "/api/public-users/login",
                            method: HTTP_METHOD.POST,
                            body: credentials,
                        });
                        const user = await res.json();
                        const cookies = res.headers.getSetCookie();
                        setPayloadCookie(cookies);

                        const { email, id, createdAt } = user.user;
                        return {
                            email,
                            id,
                            createdAt,
                        };
                    } catch (error) {
                        if (error instanceof HttpError) {
                            if (error.response.status === 401) {
                                return Promise.reject(
                                    new Error(AUTH_ERRORS.INVALID_CREDENTIALS)
                                );
                            } else if (error.response.status === 429) {
                                return Promise.reject(
                                    new Error(AUTH_ERRORS.RATE_LIMIT)
                                );
                            }
                        }
                        return Promise.reject(new Error(AUTH_ERRORS.UNKNOWN));
                    }
                }
                return Promise.reject(new Error(AUTH_ERRORS.NO_CREDENTIALS));
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
                        method: HTTP_METHOD.POST,
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
                            error: AUTH_ERRORS.INVALID_SESSION,
                        };
                    }
                } catch (error) {
                    return {
                        ...token,
                        error: AUTH_ERRORS.INVALID_SESSION,
                    };
                }
            }
            return { ...token, ...user };
        },
        session: async ({ session, token }: { session: any; token: JWT }) => {
            const { email, id, createdAt } = token;
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
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
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
