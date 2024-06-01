import {
    GenshinCharacterBanner,
    GenshinWeaponBanner,
    NameIconDictionary,
} from "@/types/apiResponses";
import { DATE_TIME_FORMAT, formatEventDate } from "@/utils/dateUtils";
import { getStarString } from "@/utils/utils";
import Image from "next/image";

function ItemPreview(props: {
    item: NameIconDictionary;
    rarity: number;
    small?: boolean;
}) {
    const item = props.item;
    return (
        <div className="flex flex-col items-center">
            {item.icon ? (
                <Image
                    src={item.icon}
                    alt={item.name}
                    width={0}
                    height={0}
                    sizes="100%"
                    className={props.small ? "w-10 h-10" : "w-20 h-20"}
                    title={item.name}
                />
            ) : (
                <></>
            )}
            <span className="text-electro-5star-from/80">
                {getStarString(props.rarity)}
            </span>
            <span className="text-center">{item.name}</span>
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
        <div className="flex flex-col items-center bg-electro-850 rounded p-2 cursor-pointer flex-1">
            <h2 className="text-2xl py-2">
                {!isCharacter ? "Weapon" : "Character"} Banner
            </h2>
            {item && items ? (
                <div className="w-full">
                    <div className="flex flex-col w-full md:flex-row justify-center  text-lg">
                        <span className="text-center">
                            {formatEventDate(
                                item.start,
                                item.timezoneDependent,
                                DATE_TIME_FORMAT
                            )}
                        </span>
                        <span className="text-center px-2">-</span>
                        <span className="text-center">
                            {formatEventDate(
                                item.end,
                                item.timezoneDependent,
                                DATE_TIME_FORMAT
                            )}
                        </span>
                    </div>
                    <div className="flex flex-row w-full justify-evenly items-center">
                        <ItemPreview item={items.fiveStar1} rarity={5} />
                        {items.fiveStar2 ? (
                            <ItemPreview item={items.fiveStar2} rarity={5} />
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className="w-full flex flex-row justify-evenly overflow-x-auto gap-2 p-2">
                        {items.fourStar.map((item) => (
                            <ItemPreview
                                key={"bannerDialog-" + item.name}
                                item={item}
                                rarity={4}
                                small
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
