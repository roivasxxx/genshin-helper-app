import type { Metadata } from "next";
import { Exo_2, Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { getServerSession } from "next-auth";
import Header from "@/components/root-layout/header";
// import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const exo = Exo_2({ subsets: ["latin"], variable: "--font-exo" });

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
            className={`${inter.variable} ${exo.variable} bg-electro-900`}
        >
            <AuthProvider session={session}>
                <body>
                    <Header />
                    {children}
                </body>
            </AuthProvider>
        </html>
    );
}
