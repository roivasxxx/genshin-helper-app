import { GenshinWeapon } from "@/types/genshinTypes";
import { GENSHIN_SUBSTAT_TEXT, GENSHIN_WEAPON } from "@/utils/constants";
import { getStarString } from "@/utils/utils";
import Image from "next/image";
import { ReactNode } from "react";

export default function WeaponInfo(props: { weapon: GenshinWeapon }) {
    const { weapon } = props;

    const { domain, mobDrops, refinements } = weapon;

    const refinementsText = refinements.text.split("{$}");
    const refinementValues = refinements.values.map((el) => el.join("/"));

    const combinedText: ReactNode[] = [];
    refinementsText.forEach((part, i) => {
        combinedText.push(<span key={`text-${i}`}>{part}</span>);
        if (i < refinementValues.length) {
            combinedText.push(
                <span key={`value-${i}`} className="text-sky-300">
                    {refinementValues[i]}
                </span>
            );
        }
    });

    return (
        <div
            className="flex flex-col mt-[-60vh] md:mt-0 items-center z-[1] md:block"
            style={{
                background:
                    "linear-gradient(180deg, rgba(77,63,88, 0) 0%, rgba(77,63,88,.75) 10%)",
            }}
        >
            <h1 className="text-3xl text-center md:text-left">{weapon.name}</h1>
            <div className="flex flex-row items-center mt-2">
                <span className="text-electro-5star-from text-2xl">
                    {getStarString(weapon.rarity)}
                </span>
                <div className="relative size-10 mx-2">
                    <Image
                        alt={weapon.weaponType}
                        src={
                            "/images/games/icons/genshin-impact/weapon-types/" +
                            weapon.weaponType +
                            ".png"
                        }
                        fill={true}
                        sizes="100%"
                        className="object-scale-down"
                        title={
                            GENSHIN_WEAPON[
                                weapon.weaponType as keyof typeof GENSHIN_WEAPON
                            ]
                        }
                    />
                </div>
            </div>

            <div className="w-[80%] my-2 border-b-2 border-electro-50/20">
                <table className="min-w-[50%]">
                    <caption className="text-electro-50 text-2xl text-left">
                        {"Stats (Lv.90)"}
                    </caption>
                    <tbody>
                        <tr>
                            <td className="text-electro-50 text-xl text-left">
                                Base Attack
                            </td>
                            <td className="text-electro-50 text-lg text-left px-2">
                                {weapon.stats.primary.value}
                            </td>
                        </tr>
                        <tr>
                            <td className="text-electro-50 text-xl text-left">
                                {
                                    GENSHIN_SUBSTAT_TEXT[
                                        weapon.stats.secondary.stat
                                    ]
                                }
                            </td>
                            <td className="text-electro-50 text-lg text-left px-2">
                                {weapon.stats.secondary.value}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="w-[80%] my-2">
                <h2 className="text-electro-50 text-2xl text-left">Passive</h2>
                <div className="bg-electro-900 p-2 rounded">
                    <div className="italic">{weapon.refinements.name}</div>
                    <div>{combinedText}</div>
                </div>
            </div>

            <table className="w-[80%] my-2 border-b-2 border-electro-50/20">
                <caption className="text-electro-50 text-2xl text-left">
                    Level Up Materials
                </caption>
                <tbody>
                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Domain
                        </td>
                        <td className="text-electro-50 text-md grid grid-cols-3 align-top">
                            {domain.map((domainDrop) => {
                                return (
                                    <span
                                        key={domainDrop.name}
                                        title={domainDrop.name}
                                    >
                                        {domainDrop.icon ? (
                                            <Image
                                                src={domainDrop.icon}
                                                alt={domainDrop.name}
                                                height={40}
                                                width={40}
                                                loader={({ src }) => src}
                                            />
                                        ) : (
                                            domainDrop.name
                                        )}
                                    </span>
                                );
                            })}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Mob Drop 1
                        </td>
                        <td className="text-electro-50 text-md grid grid-cols-3 align-top">
                            {mobDrops.first.map((mobDrop) => {
                                return (
                                    <span
                                        key={mobDrop.name}
                                        title={mobDrop.name}
                                    >
                                        {mobDrop.icon ? (
                                            <Image
                                                src={mobDrop.icon}
                                                alt={mobDrop.name}
                                                height={40}
                                                width={40}
                                                loader={({ src }) => src}
                                            />
                                        ) : (
                                            mobDrop.name
                                        )}
                                    </span>
                                );
                            })}
                        </td>
                    </tr>

                    <tr>
                        <td className="text-electro-50 text-xl text-left w-1/2">
                            Mob Drop 2
                        </td>
                        <td className="text-electro-50 text-md grid grid-cols-3 align-top">
                            {mobDrops.second.map((mobDrop) => {
                                return (
                                    <span
                                        key={mobDrop.name}
                                        title={mobDrop.name}
                                    >
                                        {mobDrop.icon ? (
                                            <Image
                                                src={mobDrop.icon}
                                                alt={mobDrop.name}
                                                height={40}
                                                width={40}
                                                loader={({ src }) => src}
                                            />
                                        ) : (
                                            mobDrop.name
                                        )}
                                    </span>
                                );
                            })}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Character builds? */}
        </div>
    );
}
