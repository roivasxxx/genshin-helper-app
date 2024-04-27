import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";
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
    // rateLimit:{
    //     https://payloadcms.com/docs/production/preventing-abuse
    // },
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
