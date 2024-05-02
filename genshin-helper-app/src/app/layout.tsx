import type { Metadata } from "next";
import { Bebas_Neue, Exo_2, Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import AuthProvider from "@/components/authentication/authProvider";
import Footer from "@/components/footer";
// import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const exo = Exo_2({ subsets: ["latin"], variable: "--font-exo" });

const silkscreen = Bebas_Neue({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-bebas",
});

export const metadata: Metadata = {
    title: "Electro Mains",
    description: "Electro Mains",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();

    return (
        <html
            lang="en"
            className={`${inter.variable} ${exo.variable} ${silkscreen.variable} bg-electro-900`}
        >
            <AuthProvider session={session}>
                <body>
                    {children}
                    <Footer />
                </body>
            </AuthProvider>
        </html>
    );
}
