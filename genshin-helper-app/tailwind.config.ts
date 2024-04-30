import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
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
                    900: "#342A3B",
                },
            },
            fontFamily: {
                exo: ["var(--font-exo)"],
                inter: ["var(--font-inter)"],
                bebas: ["var(--font-bebas)"],
            },
        },
    },
    plugins: [],
};
export default config;
