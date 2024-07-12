import { NameIconWithIdDictionary } from "@/types/genshinTypes";
import Image from "next/image";
import Link from "next/link";

export default function BannerCharacterPreview(props: {
    char: NameIconWithIdDictionary;
    href: string;
    rarity: number;
}) {
    const { char, href, rarity } = props;
    return (
        <Link
            href={href}
            className={`relative text-electro-50 size-10 md:size-14 text-md bg-electro-${rarity}star-from/50 rounded overflow-hidden`}
        >
            {char.icon ? (
                <Image
                    src={char.icon}
                    alt={char.name}
                    fill={true}
                    sizes="100%"
                    title={char.name}
                />
            ) : (
                <>fiveStar.name</>
            )}
        </Link>
    );
}
