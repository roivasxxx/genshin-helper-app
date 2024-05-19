"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
export default function AuthProvider({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session | null;
}) {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then(async (registration) => {
                    await registration.update();
                    console.log(
                        "Service Worker registered with scope:",
                        registration.scope
                    );
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });
        }
    }, []);

    return <SessionProvider session={session}>{children}</SessionProvider>;
}
