import LoadingLogo from "@/components/loadingLogo";
import { HTTP_METHOD } from "@/types";
import { FIFTY_FIFTY_STATUS, ItemWithPity } from "@/types/genshinTypes";
import { BANNER_TYPE, STAR_SYMBOL } from "@/utils/constants";
import cmsRequest from "@/utils/fetchUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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

    const fourStarTotal = state.fourStar.length;
    const fourStarCharacters = state.fourStar.filter(
        (el) => el.type === BANNER_TYPE.CHARACTER
    );
    const fourStarWeapons = state.fourStar.filter(
        (el) => el.type === BANNER_TYPE.WEAPON
    );
    const fourStarPityWon = state.fourStar.reduce((acc, item) => {
        if (item.fiftyFiftyStatus === FIFTY_FIFTY_STATUS.WON) {
            return acc + item.pity;
        }
        return acc;
    }, 0);
    const fourStarPityPercentage =
        (fourStarPityWon / (fourStarTotal || 1)) * 100;

    const fiveStarTotal = state.fiveStar.length;
    const fiveStarCharacters = state.fiveStar.filter(
        (el) => el.type === BANNER_TYPE.CHARACTER
    );
    const fiveStarWeapons = state.fiveStar.filter(
        (el) => el.type === BANNER_TYPE.WEAPON
    );
    const fiveStarPityWon = state.fiveStar.reduce((acc, item) => {
        if (item.fiftyFiftyStatus === FIFTY_FIFTY_STATUS.WON) {
            return acc + item.pity;
        }
        return acc;
    }, 0);
    const fiveStarPityPercentage =
        (fiveStarPityWon / (fiveStarTotal || 1)) * 100;

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

    const pieData = [
        {
            name: `3 ${STAR_SYMBOL}`,
            value: state.total - fourStarTotal - fiveStarTotal,
            color: "rgba(125,211,252,0.5)",
            colorActive: "rgba(125,211,252,1)",
        },
        {
            name: `4 ${STAR_SYMBOL}`,
            value: fourStarTotal,
            color: "rgba(210,143,214,0.5)",
            colorActive: "rgba(210,143,214,1)",
        },
        {
            name: `5 ${STAR_SYMBOL}`,
            value: fiveStarTotal,
            color: "rgba(255,177,63,0.5)",
            colorActive: "rgba(255,177,63,1)",
        },
    ];

    const CustomTooltip = ({ active: active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div
                    className="bg-electro-900 rounded p-2 chart"
                    style={{
                        color: item.colorActive,
                    }}
                >
                    <p>{`${payload[0].name} : ${payload[0].value}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <>
            {!state.loading ? (
                <div className="h-60">
                    Overview
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                        className="chart"
                    >
                        <PieChart
                            width={400}
                            height={400}
                            tabIndex={-1}
                            className="chart"
                        >
                            <Pie
                                data={pieData}
                                outerRadius={80}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                dataKey="value"
                                tabIndex={-1}
                                rootTabIndex={-1}
                                className="chart"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke={"none"}
                                        tabIndex={-1}
                                        className="chart"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={CustomTooltip} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="w-full flex items-center justify-center">
                    <LoadingLogo size="size-40" />
                </div>
            )}
        </>
    );
}
