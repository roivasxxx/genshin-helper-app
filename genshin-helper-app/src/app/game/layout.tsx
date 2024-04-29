import type { Metadata } from "next";
import Header from "@/components/root-layout/nav/header";

export default async function GameLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
