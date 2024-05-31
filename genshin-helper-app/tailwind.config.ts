import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    future: {
        hoverOnlyWhenSupported: true,
    },
    theme: {
        extend: {
            width: {
                "1/7": "14.2857143%",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            gridTemplateColumns: {
                "15": "repeat(15, minmax(0, 1fr))",
            },
            screens: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                "2xl": "1536px",
            },
            colors: {
                electro: {
                    // https://colorgen.dev
                    50: "#FBF9FC",
                    100: "#F7F4F9",
                    200: "#EAE2F0",
                    300: "#DED1E7",
                    400: "#C5AFD6",
                    500: "#AC8CC4",
                    600: "#9B7EB0",
                    700: "#675476",
                    800: "#4D3F58",
                    850: "#614868",
                    900: "#342A3B",
                    "4star": {
                        from: "#D28FD6",
                        to: "#665680",
                    },
                    "5star": {
                        from: "#FFB13F",
                        to: "#846332",
                    },
                },
            },
            fontFamily: {
                exo: ["var(--font-exo)"],
                inter: ["var(--font-inter)"],
                bebas: ["var(--font-bebas)"],
            },
        },
    },
    plugins: [
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    "auto-fill": (value) => ({
                        gridTemplateColumns: `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`,
                    }),
                    "auto-fit": (value) => ({
                        gridTemplateColumns: `repeat(auto-fit, minmax(min(${value}, 100%), 1fr))`,
                    }),
                },
                {
                    values: theme("width"),
                }
            );
        }),
    ],
};
export default config;
