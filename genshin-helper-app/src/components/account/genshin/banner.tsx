"use client";

import { BANNER_TYPE } from "@/utils/constants";
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
            <BannerOverview bannerType={bannerType} accountId={accountId} />
            <BannerHistory {...props} />
        </div>
    );
}
