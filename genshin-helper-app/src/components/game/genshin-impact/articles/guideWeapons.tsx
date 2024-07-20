import { GenshinGuide } from "@/types/genshinTypes";
import GenshinGuideSection from "./section";
import ItemWithIcon from "./itemWithIcon";
import RichTextContent from "./richTextContent";

export default function GuideWeapons(props: {
    weapons: GenshinGuide["weapons"];
}) {
    const weapons = props.weapons;
    return (
        <>
            <h2 className="text-xl font-bold" id="weapons">
                Weapons
            </h2>
            <GenshinGuideSection
                sections={weapons.sections}
                keyString="weapons"
            />
            <div className="flex flex-col gap-4 w-full bg-electro-900  my-2">
                {weapons.list.map((weapon, index) => {
                    return (
                        <div
                            className="flex flex-row p-5 rounded"
                            key={"weaponsList-" + index}
                        >
                            <div className="w-3/12">
                                <ItemWithIcon item={weapon.weapon} />
                            </div>
                            <RichTextContent
                                keyString={`weapon-description-${index}`}
                                content={weapon.description}
                                className="w-9/12 text-center break-all m-auto"
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
