import { NameIconDictionary } from "@/types/genshinTypes";
import { getStarString } from "@/utils/utils";
import Image from "next/image";

export default function BannerItemPreview(props: {
    item: NameIconDictionary;
    rarity: number;
}) {
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
