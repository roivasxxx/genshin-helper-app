import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";
import { PayloadRequest } from "payload/types";
import cloudinaryPlugin from "@roivasxxx/payload-cloudinary-plugin/dist/plugins";
import Users from "./collections/Users";
import { collections } from "./collections";
// webpack
const mockModulePath = path.resolve(__dirname, "../src/mocks/emptyFunction.ts");
const agendaMockModulePath = path.resolve(
    __dirname,
    "../src/mocks/emptyAgenda.ts"
);
const agendaPath = path.resolve(__dirname, "../src/agenda");

export default buildConfig({
    admin: {
        user: Users.slug,
        bundler: webpackBundler(),
        webpack: (config) => ({
            ...config,
            resolve: {
                ...config.resolve,
                extensions: [".ts", ".tsx", ".js", ".jsx"],
                alias: {
                    ...config.resolve.alias,
                    fs: mockModulePath,
                    dotenv: mockModulePath,
                    [agendaPath]: agendaMockModulePath,
                    Agenda: false,
                    agenda: false,
                    mongodb: false,
                    // add other server modules
                },
                fallback: {
                    ...config.resolve.fallback,
                    fs: false,
                    [agendaPath]: false,
                    agenda: false,
                    Agenda: false,
                    mongodb: false,
                },
            },
        }),
    },
    // rateLimit: {
    //     implement custom express rate limiter, that can be set up on a per route basis
    //     max: 1,
    //     window: 500,
    //     // https://payloadcms.com/docs/production/preventing-abuse
    // },
    rateLimit: {
        skip(req: PayloadRequest) {
            // skip rate limit for requests with skipRateLimitKey
            // these request are made when the frontend is building SSG pages
            // TODO: add allowed endpoint list here
            return (
                req.query &&
                req.query.skipRateLimitKey &&
                req.query.skipRateLimitKey === process.env.SKIP_RATE_LIMIT_KEY
            );
        },
    },
    editor: slateEditor({}),
    collections: collections,
    typescript: {
        outputFile: path.resolve(__dirname, "../types/payload-types.ts"),
    },
    graphQL: {
        disable: true,
    },
    plugins: [payloadCloud(), cloudinaryPlugin()],
    db: mongooseAdapter({
        url: process.env.DATABASE_URI,
    }),
    serverURL: process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL,
    cors: process.env.WHITELIST_ORIGINS
        ? process.env.WHITELIST_ORIGINS.split(",")
        : [],
    csrf: process.env.WHITELIST_ORIGINS
        ? process.env.WHITELIST_ORIGINS.split(",")
        : [],
});
