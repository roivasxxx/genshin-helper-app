import {
    GenshinCharacterBanner,
    GenshinWeaponBanner,
    NameIconDictionary,
} from "@/types/genshinTypes";
import { DATE_TIME_FORMAT, formatEventDate } from "@/utils/dateUtils";
import { getStarString } from "@/utils/utils";
import Image from "next/image";

function ItemPreview(props: { item: NameIconDictionary; rarity: number }) {
    const item = props.item;
    return (
        <div className="flex flex-col items-center min-w-[72px] shrink-0 max-w-[140px]">
            {item.icon ? (
                <Image
                    src={item.icon}
                    alt={item.name}
                    width={0}
                    height={0}
                    sizes="100%"
                    className={"w-20 h-20"}
                    title={item.name}
                />
            ) : (
                <></>
            )}
            <span className="text-electro-5star-from/80">
                {getStarString(props.rarity)}
            </span>
            <span className="text-center break-words text-sm md:text-md">
                {item.name}
            </span>
        </div>
    );
}

export default function BannerItem(props: {
    item: GenshinCharacterBanner | GenshinWeaponBanner | null;
}) {
    const item = props.item;
    const isCharacter = item && item?.bannerType === "character";
    const items = isCharacter ? item.characters : item?.weapons;

    return (
        <div className="flex p flex-col items-center bg-electro-850 rounded p-4 cursor-pointer flex-1 overflow-auto">
            <h2 className="text-2xl py-2">
                {!isCharacter ? "Weapon" : "Character"} Banner
            </h2>
            {item && items ? (
                <div className="flex flex-col w-full items-center">
                    <div className="flex flex-col w-full md:flex-row items-center justify-center text-sm md:text-lg mb-2">
                        <span className="text-center text-nowrap">
                            {formatEventDate(
                                item.start,
                                item.timezoneDependent,
                                DATE_TIME_FORMAT
                            )}
                        </span>
                        <span className="text-center px-2">-</span>
                        <span className="text-center text-nowrap">
                            {formatEventDate(
                                item.end,
                                item.timezoneDependent,
                                DATE_TIME_FORMAT
                            )}
                        </span>
                    </div>
                    <div className="flex flex-row w-[90%] gap-2 justify-between md:w-full overflow-auto h-44">
                        <ItemPreview item={items.fiveStar1} rarity={5} />
                        {items.fiveStar2 ? (
                            <ItemPreview item={items.fiveStar2} rarity={5} />
                        ) : (
                            <></>
                        )}
                        {items.fourStar.map((item) => (
                            <ItemPreview
                                key={"bannerDialog-" + item.name}
                                item={item}
                                rarity={4}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <>{"Banner info not found :("}</>
            )}
        </div>
    );
}
