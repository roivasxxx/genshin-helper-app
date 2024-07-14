import LoadingLogo from "@/components/loadingLogo";
import { HTTP_METHOD } from "@/types";
import { ItemWithPity } from "@/types/genshinTypes";
import { BANNER_TYPE, STAR_SYMBOL } from "@/utils/constants";
import cmsRequest from "@/utils/fetchUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PullsByRarityChart from "./pullsByRarityChart";
import ItemStats from "./itemStats";

export default function BannerOverview(props: {
    bannerType: BANNER_TYPE;
    accountId: string;
}) {
    const { bannerType, accountId } = props;

    const [state, setState] = useState<{
        total: number;
        fourStar: ItemWithPity[];
        fiveStar: ItemWithPity[];
        guaranted4Star: boolean;
        guaranted5Star: boolean;
        fourStarPity: number;
        fiveStarPity: number;
        loading: boolean;
    }>({
        total: 0,
        fourStar: [],
        fiveStar: [],
        loading: true,
        fiveStarPity: 0,
        fourStarPity: 0,
        guaranted4Star: false,
        guaranted5Star: false,
    });

    const router = useRouter();

    useEffect(() => {
        const abortController = new AbortController();
        const getStats = async () => {
            try {
                const req = await cmsRequest({
                    method: HTTP_METHOD.GET,
                    path: `/api/genshin-accounts/getBannerTypeOverview?accountId=${accountId}&bannerType=${bannerType}`,
                    abortController,
                });

                const data = await req.json();
                setState((state) => ({
                    ...state,
                    ...data,
                    loading: false,
                }));
            } catch (error: any) {
                if (error?.name === "AbortError") return;
                router.replace(`/me/genshin-impact/${accountId}`);
            }
        };
        getStats();

        return () => {
            abortController.abort();
        };
    }, []);

    return (
        <>
            {!state.loading ? (
                <>
                    <div className="h-max w-full grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                        <div className="flex-1 bg-electro-900 rounded p-2 text-lg">
                            <h2 className="text-xl font-bold">General Stats</h2>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-left">
                                            Total pulls
                                        </td>
                                        <td className="text-right">
                                            {state.total}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-left">
                                            {`5 ${STAR_SYMBOL} pity`}
                                        </td>
                                        <td className="text-right text-electro-5star-from">
                                            {state.fiveStarPity}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-left">
                                            {`4 ${STAR_SYMBOL} pity`}
                                        </td>
                                        <td className="text-right text-electro-4star-from">
                                            {state.fourStarPity}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-left">
                                            {`5 ${STAR_SYMBOL} 50/50 guaranteed: `}
                                        </td>
                                        <td className="text-right text-electro-5star-from">
                                            {state.guaranted5Star ? "✓" : "✘"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-left">
                                            {`4 ${STAR_SYMBOL} 50/50 guaranteed: `}
                                        </td>
                                        <td className="text-right text-electro-4star-from">
                                            {state.guaranted4Star ? "✓" : "✘"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <ItemStats
                            bannerType={bannerType}
                            fiveStar={state.fiveStar}
                            fourStar={state.fourStar}
                            total={state.total}
                        />
                        <PullsByRarityChart
                            total={state.total}
                            fiveStarTotal={state.fiveStar.length}
                            fourStarTotal={state.fourStar.length}
                        />
                    </div>
                </>
            ) : (
                <div className="w-full flex items-center justify-center">
                    <LoadingLogo size="size-40" />
                </div>
            )}
        </>
    );
}
