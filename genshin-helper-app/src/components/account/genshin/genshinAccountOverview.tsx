"use client";
import { HTTP_METHOD } from "@/types";
import cmsRequest from "@/utils/fetchUtils";
import { useEffect } from "react";

export default function GenshinAccountOverview(props: { accountId: string }) {
    const { accountId } = props;

    useEffect(() => {
        const getAccount = async () => {
            try {
                const req = await cmsRequest({
                    method: HTTP_METHOD.GET,
                    path: `api/genshin-accounts/getAccount?accountId=${accountId}`,
                });
                const result = await req.json();
            } catch (error) {
                console.error(error);
            }
        };
        getAccount();
    }, [accountId]);

    return <></>;
}
