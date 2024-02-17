import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";
import cloudinaryPlugin from "payload-cloudinary-plugin/dist/plugins";

// webpack
const mockModulePath = path.resolve(__dirname, "../src/mocks/emptyFunction.ts");

import Users from "./collections/Users";
import PublicUsers from "./collections/PublicUsers";
import { Media } from "./collections/Media";
import GenshinElements from "./collections/GenshinElements";

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
                    // add other server modules
                },
            },
        }),
    },
    editor: slateEditor({}),
    collections: [Users, PublicUsers, Media, GenshinElements],
    typescript: {
        outputFile: path.resolve(__dirname, "payload-types.ts"),
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
