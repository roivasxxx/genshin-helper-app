declare module NodeJS {
    interface ProcessEnv {
        ROOT_DOMAIN?: string;
        NEXTAUTH_URL?: string;
        NEXTAUTH_SECRET?: string;
        NEXTAUTH_URL_INTERNAL?: string;
        NEXT_PUBLIC_FE_BASE_URL?: string;
        NEXT_PUBLIC_BACKEND_URL?: string;
        SKIP_RATE_LIMIT_KEY?: string;
    }
}
