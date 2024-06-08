import HistoryIcon from "@/components/historyIcon";
import { BannerInfo, WishInfo } from "@/types/apiResponses";
import { BannerType, PRIMOS_PER_WISH, STAR_SYMBOL } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";

function BannerItem(props: {
    bannerInfo: BannerInfo;
    type: BannerType;
    accountId: string;
}) {
    const bannerInfo = props.bannerInfo;
    return (
        <Link
            href={`/me/genshin-impact/${
                props.accountId
            }/${props.type.toLowerCase()}?page=1`}
            className="bg-electro-900 rounded p-2 text-lg"
            title="View history"
        >
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-bold text-left">
                    {props.type} banner
                </h2>
                <HistoryIcon className="size-10 fill-electro-50 py-2 hover:fill-electro-500 active:fill-electro-500" />
            </div>
            <hr />
            <div className="w-full flex justify-between">
                <span className="flex-1">Pull count</span>
                <span className="text-right flex-1">
                    {bannerInfo.pullCount}
                </span>
            </div>
            <div className="w-full flex justify-between">
                <span className="flex-1">
                    Pity
                    <span className="text-electro-5star-from">{` 5${STAR_SYMBOL}`}</span>
                </span>
                <span className="text-right flex-1">
                    {bannerInfo.pity5Star}
                </span>
            </div>
            <div className="w-full flex justify-between">
                <span className="flex-1 text-nowrap">
                    Last
                    <span className=" text-electro-5star-from">
                        {` 5${STAR_SYMBOL}`}
                    </span>
                </span>
                <span className="text-right flex-2 text-base">
                    {bannerInfo.last5Star}
                </span>
            </div>
            <div className="w-full flex justify-between">
                <span className="flex-1">
                    Pity
                    <span className="text-electro-4star-from">{` 4${STAR_SYMBOL}`}</span>
                </span>
                <span className="text-right flex-1">
                    {bannerInfo.pity4Star}
                </span>
            </div>
            <div className="w-full flex justify-between">
                <span className="flex-1 text-nowrap">
                    Last
                    <span className=" text-electro-4star-from">
                        {` 4${STAR_SYMBOL}`}
                    </span>
                </span>
                <span className="text-right flex-2 text-base">
                    {bannerInfo.last4Star}
                </span>
            </div>
            <hr />
            <div className="w-full flex justify-end items-center pt-2">
                {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 0,
                    useGrouping: true,
                })
                    .format(PRIMOS_PER_WISH * bannerInfo.pullCount)
                    .replace(/,/g, " ")}
                <Image
                    src="/images/primogem.png"
                    alt="primogem"
                    width={32}
                    height={16}
                    sizes="100%"
                    className="ml-2 object-contain"
                />
            </div>
        </Link>
    );
}

export default function AccountBannerOverview(props: {
    wishInfo: WishInfo;
    accountId: string;
}) {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-2">
            <BannerItem
                bannerInfo={props.wishInfo.character}
                type={BannerType.CHARACTER}
                accountId={props.accountId}
            />
            <BannerItem
                bannerInfo={props.wishInfo.weapon}
                type={BannerType.WEAPON}
                accountId={props.accountId}
            />
            <BannerItem
                bannerInfo={props.wishInfo.standard}
                type={BannerType.STANDARD}
                accountId={props.accountId}
            />
        </div>
    );
}
