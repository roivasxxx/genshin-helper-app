import { NameIconWithIdDictionary } from "@/types/genshinTypes";
import Image from "next/image";

export default function ItemWithIcon(props: {
    item: NameIconWithIdDictionary;
}) {
    return (
        <div className="flex flex-col items-center break-all">
            {props.item.icon ? (
                <Image
                    src={props.item.icon}
                    alt={props.item.name}
                    height={80}
                    width={80}
                />
            ) : (
                <></>
            )}
            <span className="text-sm text-center md:text-lg">
                {props.item.name}
            </span>
        </div>
    );
}
