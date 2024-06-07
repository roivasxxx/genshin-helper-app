"use client";
import CSVIcon from "@/components/csvIcon";
import JsonIcon from "@/components/jsonIcon";
import LoadingLogo from "@/components/loadingLogo";
import { HTTP_METHOD } from "@/types";
import { GenshinAccount, IMPORT_STATUS } from "@/types/apiResponses";
import cmsRequest, { createResource } from "@/utils/fetchUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OverviewHeader from "./overviewHeader";

export default function GenshinAccountOverview(props: { accountId: string }) {
    const { accountId } = props;

    const [accountData, setAccountData] = useState<GenshinAccount>({
        accountId,
        region: "",
        wishInfo: {
            standard: {
                pullCount: 0,
                last4Star: null,
                last5Star: null,
                pity4Star: 0,
                pity5Star: 0,
                lastId: null,
            },
            weapon: {
                pullCount: 0,
                last4Star: null,
                last5Star: null,
                pity4Star: 0,
                pity5Star: 0,
                lastId: null,
            },
            character: {
                pullCount: 0,
                last4Star: null,
                last5Star: null,
                pity4Star: 0,
                pity5Star: 0,
                lastId: null,
            },
        },
        importJobStatus: "NONE",
    });
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const abortController = new AbortController();
        const getAccount = async () => {
            try {
                const req = await cmsRequest({
                    method: HTTP_METHOD.GET,
                    path: `api/genshin-accounts/getAccount?accountId=${accountId}`,
                    abortController,
                });
                const result = await req.json();
                setAccountData(result);
                console.log(result);
            } catch (error) {
                console.error(error);
                router.replace("/me");
            }
            setIsLoading(false);

            const timer = setTimeout(async () => {
                const req = await cmsRequest({
                    method: HTTP_METHOD.GET,
                    path: `api/genshin-accounts/getImportStatus?accountId=${accountId}`,
                    abortController,
                });
                const result = await req.text();
                if (result !== accountData.importJobStatus) {
                    console.log(result, accountData.importJobStatus);
                    setAccountData({
                        ...accountData,
                        importJobStatus:
                            result as typeof accountData.importJobStatus,
                    });
                }
            }, 10000);

            return () => {
                abortController.abort();
                clearTimeout(timer);
            };
        };

        getAccount();
    }, [accountId]);

    const importHistory = async (link: string) => {
        try {
            await cmsRequest({
                method: HTTP_METHOD.POST,
                path: `api/genshin-accounts/importHistory`,
                body: {
                    accountId,
                    link,
                },
            });
            setAccountData({
                ...accountData,
                importJobStatus: "NEW",
            });
        } catch (error) {
            setAccountData({
                ...accountData,
                importJobStatus: "FAILED",
            });
        }
    };

    return (
        <div className="w-full flex flex-col bg-electro-800 rounded rounded p-2">
            <h1 className="text-2xl text-center">{accountId}</h1>
            {isLoading ? (
                <div className="w-full flex items-center justify-center">
                    <LoadingLogo size="size-40" />
                </div>
            ) : (
                <>
                    <OverviewHeader
                        accountData={accountData}
                        importHistory={importHistory}
                    />
                </>
            )}
        </div>
    );
}
