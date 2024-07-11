"use client";
import Arrow from "@/components/arrow";
import LoadingLogo from "@/components/loadingLogo";
import { HTTP_METHOD } from "@/types";
import { Wish } from "@/types/apiResponses";
import { STAR_SYMBOL } from "@/utils/constants";
import cmsRequest from "@/utils/fetchUtils";
import { paginate } from "@/utils/pagination";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function BannerHistory(props: {
    bannerType: string;
    accountId: string;
    page: number;
}) {
    const [state, setState] = useState<{
        currentPage: number;
        items: Wish[];
        totalPages: number;
        loading: boolean;
    }>({
        currentPage: props.page,
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
            path: `/api/genshin-accounts/getWishHistory?accountId=${props.accountId}&type=${props.bannerType}&offset=${page}`,
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

    return (
        <div className="w-full  flex flex-col bg-electro-800 rounded p-5">
            <h1 className="text-2xl">Wish history</h1>
            {!state.loading ? (
                <>
                    <table className="bg-electro-900 mt-2 rounded wishTable">
                        <thead>
                            <tr className="text-left text-xl font-bold">
                                <td className="p-2">Date</td>
                                <td className="p-2">Item</td>
                                <td className="text-center p-2">Rarity</td>
                                <td className="text-center p-2">Pity</td>
                                <td className="text-center p-2">Wish #</td>
                            </tr>
                        </thead>
                        <tbody className="text-left text-base">
                            {state.items.map((wish) => {
                                let bgColor = "inherit";
                                let starColor = "text-sky-300";
                                if (wish.rarity === 5) {
                                    bgColor =
                                        "bg-gradient-to-r from-electro-900 via-electro-5star-from/50 to-electro-900";
                                    starColor = "text-electro-5star-from";
                                } else if (wish.rarity === 4) {
                                    bgColor =
                                        "bg-gradient-to-r from-electro-900 via-electro-4star-from/50 to-electro-900";
                                    starColor = "text-electro-4star-from";
                                }

                                return (
                                    <tr
                                        key={wish.hoyoId}
                                        className={
                                            "text-lg font-bold " + bgColor
                                        }
                                    >
                                        <td className="text-base">
                                            {wish.date}
                                        </td>
                                        <td className="">
                                            {wish.item.icon ? (
                                                <Image
                                                    src={wish.item.icon.url}
                                                    alt={wish.item.value}
                                                    width={40}
                                                    height={40}
                                                    className="md:inline"
                                                />
                                            ) : (
                                                <></>
                                            )}
                                            {wish.item.value}
                                        </td>
                                        <td
                                            className={
                                                starColor + " text-center"
                                            }
                                        >{`${wish.rarity} ${STAR_SYMBOL}`}</td>
                                        <td className="text-center">
                                            {wish.pity}
                                        </td>
                                        <td className="text-center">
                                            {wish.wishNumber + 1}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
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
                </>
            ) : (
                <div className="w-full flex items-center justify-center">
                    <LoadingLogo size="size-40" />
                </div>
            )}
        </div>
    );
}
