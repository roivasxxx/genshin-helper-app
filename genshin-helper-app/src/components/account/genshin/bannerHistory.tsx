"use client";
import Arrow from "@/components/arrow";
import LoadingLogo from "@/components/loadingLogo";
import { HTTP_METHOD } from "@/types";
import { Wish } from "@/types/genshinTypes";
import { BANNER_TYPE } from "@/utils/constants";
import cmsRequest from "@/utils/fetchUtils";
import { paginate } from "@/utils/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BannerHistoryRow from "./bannerHistoryRow";

export default function BannerHistory(props: {
    bannerType: BANNER_TYPE;
    accountId: string;
    page: number;
}) {
    const { bannerType, accountId, page } = props;
    const [state, setState] = useState<{
        currentPage: number;
        items: Wish[];
        totalPages: number;
        loading: boolean;
    }>({
        currentPage: page,
        items: [],
        totalPages: 0,
        loading: true,
    });
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const getData = useCallback(async (page: number) => {
        setState((state) => ({ ...state, loading: true }));
        const req = await cmsRequest({
            method: HTTP_METHOD.GET,
            path: `/api/genshin-accounts/getWishHistory?accountId=${accountId}&type=${bannerType}&offset=${page}`,
        });
        const data = await req.json();
        setState(() => ({
            items: data.history,
            totalPages: data.totalPages,
            currentPage: page,
            loading: false,
        }));
        if (searchParams) {
            // replace page search param
            const params = new URLSearchParams(searchParams);
            params.set("page", page.toString());
            router.push(`${pathname}?${params.toString()}`);
        }
    }, []);

    useEffect(() => {
        getData(props.page);
    }, []);

    // TOOD
    // TOOD
    // TOOD
    // TOOD
    // TOOD
    // add pity counter, create modal, that will fetch stats about specific banner

    return (
        <div className="w-full flex flex-col bg-electro-800 rounded p-5">
            <h1 className="text-2xl">Wish history</h1>
            {!state.loading ? (
                <div className="w-full overflow-x-hidden">
                    <div className="w-full overflow-x-auto">
                        <table className="bg-electro-900 mt-2 rounded wishTable w-full overflow-x-auto">
                            <thead>
                                <tr className="text-left text-xl font-bold">
                                    <td className="p-2">Date</td>
                                    <td className="p-2">Item</td>
                                    <td className="text-center p-2">Rarity</td>
                                    <td className="text-center p-0.5">50/50</td>
                                    <td className="text-center p-2">Pity</td>
                                    <td className="text-center p-2">Wish #</td>
                                </tr>
                            </thead>
                            <tbody className="text-left text-base overflow-x-auto">
                                {state.items.map((wish) => (
                                    <BannerHistoryRow
                                        wish={wish}
                                        key={wish.hoyoId}
                                        bannerType={props.bannerType}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-row items-stretch justify-end w-full mt-2 gap-2">
                        <button
                            className={`flex items-center justify-center group text-lg font-bold cursor-pointer p-2 rounded hover:bg-electro-900/60 active:bg-electro-900/60 disabled:cursor-not-allowed disabled:bg-slate-500/60`}
                            disabled={state.currentPage === 1}
                            onClick={() => getData(state.currentPage - 1)}
                        >
                            <Arrow size="small" className="rotate-[135deg]" />
                        </button>
                        {paginate(state.currentPage, state.totalPages).map(
                            (el, index) => {
                                if (typeof el === "number") {
                                    return (
                                        <button
                                            onClick={() => getData(el)}
                                            disabled={state.currentPage === el}
                                            key={"page-" + el}
                                            className={`text-lg font-bold cursor-pointer p-2 rounded hover:text-electro-500 hover:bg-electro-900/60 active:text-electro-500 active:bg-electro-900/60 ${
                                                state.currentPage === el
                                                    ? "bg-electro-900/60 text-electro-500"
                                                    : ""
                                            }`}
                                        >
                                            {el}
                                        </button>
                                    );
                                }
                                return (
                                    <span key={"ellipsis-" + index}>{el}</span>
                                );
                            }
                        )}
                        <button
                            className={`flex items-center justify-center group text-lg font-bold cursor-pointer p-2 rounded hover:bg-electro-900/60 active:bg-electro-900/60 disabled:cursor-not-allowed disabled:bg-slate-500/60`}
                            disabled={state.currentPage === state.totalPages}
                            onClick={() => getData(state.currentPage + 1)}
                        >
                            <Arrow
                                size="small"
                                className="group-hover:border-electro-500"
                            />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full flex items-center justify-center">
                    <LoadingLogo size="size-40" />
                </div>
            )}
        </div>
    );
}
