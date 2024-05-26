import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import AuthProvider from "@/components/authentication/authProvider";
import Footer from "@/components/footer";
import { exo, inter, silkscreen } from "@/utils/fonts";
// import { authOptions } from "./api/auth/[...nextauth]/route";

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
                <body className="flex flex-col min-h-screen">{children}</body>
            </AuthProvider>
        </html>
    );
}
