import { NameIconWithDescriptionDictionary } from "@/types/apiResponses";
import Image from "next/image";

export default function PassiveConstellation(props: {
    item: NameIconWithDescriptionDictionary;
}) {
    const item = props.item;

    return (
        <div className="mt-2 border-b-2 p-2">
            <div className="flex flex-row items-center">
                <div className="w-16 flex-shrink-0 md:mr-2">
                    {item?.icon ? (
                        <Image
                            alt={item.name}
                            src={item.icon}
                            height={0}
                            width={0}
                            sizes="100%"
                            className="h-10 w-auto md:h-16"
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-lg">{item.name}</span>
                    <span
                        dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                </div>
            </div>
        </div>
    );
}
