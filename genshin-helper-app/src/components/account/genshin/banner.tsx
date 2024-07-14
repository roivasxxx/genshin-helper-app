"use client";

import { BANNER_TYPE, GENSHIN_BANNER_NAME } from "@/utils/constants";
import BannerHistory from "./bannerHistory";
import BannerOverview from "./bannerOverview";

export default function Banner(props: {
    bannerType: BANNER_TYPE;
    accountId: string;
    page: number;
}) {
    const { bannerType, accountId, page } = props;

    return (
        <div className="w-full flex flex-col bg-electro-800 rounded p-5">
            <h1 className="text-2xl">
                {GENSHIN_BANNER_NAME[bannerType]} banner
            </h1>
            <BannerOverview bannerType={bannerType} accountId={accountId} />
            <BannerHistory {...props} />
        </div>
    );
}
