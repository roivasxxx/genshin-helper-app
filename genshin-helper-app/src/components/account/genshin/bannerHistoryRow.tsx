import { Wish } from "@/types/genshinTypes";
import { BANNER_TYPE, STAR_SYMBOL } from "@/utils/constants";
import Image from "next/image";

export default function BannerHistoryRow(props: {
    wish: Wish;
    bannerType: BANNER_TYPE;
}) {
    const { wish, bannerType } = props;
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

    let pity = wish.pity;
    if (bannerType !== BANNER_TYPE.STANDARD) {
        const fiftyFiftyStatus = wish.fiftyFiftyStatus;
        if (fiftyFiftyStatus === "won") {
        }
    }

    return (
        <tr className={"text-lg font-bold " + bgColor}>
            <td className="text-base">{wish.date}</td>
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
                className={starColor + " text-center"}
            >{`${wish.rarity} ${STAR_SYMBOL}`}</td>
            <td className="text-center">{wish.pity}</td>
            <td className="text-center">{wish.wishNumber + 1}</td>
        </tr>
    );
}
