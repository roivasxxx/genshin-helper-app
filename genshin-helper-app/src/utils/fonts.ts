import { Bebas_Neue, Exo_2, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const exo = Exo_2({ subsets: ["latin"], variable: "--font-exo" });

const silkscreen = Bebas_Neue({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-bebas",
});

export { inter, exo, silkscreen };
