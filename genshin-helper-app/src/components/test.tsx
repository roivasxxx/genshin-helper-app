"use client";

import cmsRequest from "@/utils/fetchUtils";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Test() {
    useEffect(() => {
        cmsRequest({ path: "/api/public-users/me", method: "GET" }).then(
            async (res) => console.log(await res.json())
        );
    }, []);
    return (
        <>
            <button
                onClick={async () => {
                    await signOut({ redirect: true, callbackUrl: "/login" });
                }}
            >
                Sign out
            </button>
        </>
    );
}
