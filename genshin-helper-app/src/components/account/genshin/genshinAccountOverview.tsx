"use client";

import LoadingLogo from "@/components/loadingLogo";
import { HTTP_METHOD } from "@/types";
import { GenshinAccount, IMPORT_STATUS } from "@/types/apiResponses";
import cmsRequest from "@/utils/fetchUtils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import OverviewHeader from "./overviewHeader";
import AccountBannerOverview from "./accountBannerOverview";

export default function GenshinAccountOverview(props: { accountId: string }) {
    const { accountId } = props;

    const timerRef = useRef<{
        timer: NodeJS.Timeout | null;
        abortController: AbortController | null;
    }>({ timer: null, abortController: null });

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
    const [errorVisible, setErrorVisible] = useState(false);

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

            return () => {
                console.log("unmount?");
                abortController.abort();
                if (
                    timerRef.current.abortController &&
                    timerRef.current.timer
                ) {
                    timerRef.current.abortController.abort();
                    clearInterval(timerRef.current.timer);
                }
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

            const abortController = new AbortController();
            timerRef.current.abortController = abortController;
            timerRef.current.timer = setInterval(async () => {
                const req = await cmsRequest({
                    method: HTTP_METHOD.GET,
                    path: `api/genshin-accounts/getImportStatus?accountId=${accountId}`,
                    abortController: abortController,
                });
                const result = (await req.text()) as keyof typeof IMPORT_STATUS;
                setAccountData((state) => {
                    return {
                        ...state,
                        importJobStatus:
                            result as typeof accountData.importJobStatus,
                    };
                });
                if (
                    !["IN_PROGRESS", "NEW"].includes(result) &&
                    timerRef.current?.timer
                ) {
                    clearInterval(timerRef.current?.timer);
                }
            }, 10000);
        } catch (error) {
            // invalid link provided
            setErrorVisible(true);
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
                        errorVisible={errorVisible}
                        setErrorVisible={() => setErrorVisible(false)}
                    />
                    <AccountBannerOverview
                        wishInfo={accountData.wishInfo}
                        accountId={accountId}
                    />
                </>
            )}
        </div>
    );
}
