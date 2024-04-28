import { GAMES } from "./utils/constants";

export type NavConfigPath = {
    path: string;
    label: string;
};

type NavConfigPaths = Array<NavConfigPath & { subpaths?: NavConfigPath[] }>;
export type NavConfig = Record<
    GAMES,
    {
        paths: NavConfigPaths;
    }
>;

const navConfig: NavConfig = {
    [GAMES.GENSHIN]: {
        paths: [
            {
                path: "/articles",
                label: "Articles",
            },
            {
                path: "/wiki",
                label: "Wiki",
                subpaths: [
                    {
                        path: "/characters",
                        label: "Characters",
                    },
                    {
                        path: "/weapons",
                        label: "Weapons",
                    },
                    {
                        path: "/artifacts",
                        label: "Artifacts",
                    },
                    {
                        path: "/materials",
                        label: "Materials",
                    },
                    {
                        path: "/enemies",
                        label: "Enemies",
                    },
                ],
            },
        ],
    },
    [GAMES.STAR_RAIL]: {
        paths: [],
    },
    [GAMES.ZENLESS]: {
        paths: [],
    },
};
export default navConfig;
