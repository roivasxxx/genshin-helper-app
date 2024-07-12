"use client";
import { GenshinWeapon } from "@/types/genshinTypes";
import { useDeferredValue, useMemo, useState } from "react";
import ShowcaseClickable from "../showcaseClickable";
import { GENSHIN_WEAPON, STAR_SYMBOL } from "@/utils/constants";
import Image from "next/image";
import { capitalizeString } from "@/utils/utils";
import CloseIcon from "@/components/closeIcon";
import Link from "next/link";

export default function WeaponShowcase(props: { weapons: GenshinWeapon[] }) {
    const { weapons } = props;

    const [filter, setFilter] = useState({
        weaponType: "",
        rarity: "",
    });
    const deferredFilter = useDeferredValue(filter);

    const filteredData = useMemo(() => {
        if (!deferredFilter.weaponType && !deferredFilter.rarity) {
            return weapons;
        }

        return weapons.filter((item) => {
            const matchesWeapon =
                !deferredFilter.weaponType ||
                deferredFilter.weaponType === item.weaponType;

            const matchesRarity =
                !deferredFilter.rarity ||
                deferredFilter.rarity === String(item.rarity);

            return matchesWeapon && matchesRarity;
        });
    }, [weapons, deferredFilter]);

    const filterChange = (property: keyof typeof filter, value: string) => {
        setFilter({
            ...filter,
            [property]: value === filter[property] ? "" : value,
        });
    };

    return (
        <>
            <div className="w-full min-h-14 grid grid-cols-8 gap-1 xl:grid-cols-9 place-items-center my-2">
                {Object.keys(GENSHIN_WEAPON).map((weapon) => {
                    const key =
                        GENSHIN_WEAPON[weapon as keyof typeof GENSHIN_WEAPON];
                    const selected = filter.weaponType === key;
                    return (
                        <ShowcaseClickable
                            key={"weaponType-" + key}
                            onClick={() => filterChange("weaponType", key)}
                            className={`${
                                selected
                                    ? "bg-electro-600"
                                    : "bg-electro-600/50"
                            }`}
                            title={capitalizeString(key)}
                        >
                            <Image
                                src={
                                    "/images/games/icons/genshin-impact/weapon-types/" +
                                    key +
                                    ".png"
                                }
                                width={40}
                                height={40}
                                priority
                                alt={key}
                                className={`${selected ? "" : "opacity-50"}`}
                            />
                        </ShowcaseClickable>
                    );
                })}

                <ShowcaseClickable
                    onClick={() => {
                        filterChange("rarity", "3");
                    }}
                    className={`${
                        filter.rarity === "3"
                            ? "bg-electro-600 text-electro-50"
                            : "bg-electro-600/50 text-electro-50/50"
                    }`}
                    title="3 star"
                >
                    {`3 ${STAR_SYMBOL}`}
                </ShowcaseClickable>

                <ShowcaseClickable
                    onClick={() => {
                        filterChange("rarity", "4");
                    }}
                    className={`${
                        filter.rarity === "4"
                            ? "bg-electro-600 text-electro-50"
                            : "bg-electro-600/50 text-electro-50/50"
                    }`}
                    title="4 star"
                >
                    {`4 ${STAR_SYMBOL}`}
                </ShowcaseClickable>

                <ShowcaseClickable
                    onClick={() => {
                        filterChange("rarity", "5");
                    }}
                    className={`${
                        filter.rarity === "5"
                            ? "bg-electro-600 text-electro-50"
                            : "bg-electro-600/50 text-electro-50/50"
                    }`}
                    title="5 star"
                >
                    {`5 ${STAR_SYMBOL}`}
                </ShowcaseClickable>

                <button
                    onClick={() => {
                        setFilter({ weaponType: "", rarity: "" });
                    }}
                    className="flex col-span-full items-center justify-center w-full h-full min-h-10 xl:col-span-1 bg-red-600 rounded group hover:bg-red-800"
                    title="Clear filters"
                >
                    <CloseIcon className="stroke-electro-50 w-4 h-4 group-hover:stroke-electro-500" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {filteredData.map((weapon) => {
                    let bgColor = "bg-blue-400/50";
                    if (weapon.rarity === 4) {
                        bgColor = "bg-electro-4star-from/50";
                    } else if (weapon.rarity === 5) {
                        bgColor = "bg-electro-5star-from/50";
                    }

                    return (
                        <Link
                            href={`/game/genshin-impact/wiki/weapons/${weapon.id}`}
                            key={"preview-" + weapon.id}
                            className={`h-28 flex p-2 rounded bg-electro-850 text-lg`}
                        >
                            <div className="w-2/5 flex justify-center">
                                <div
                                    className={`relative w-4/5 h-full rounded p-2 ${bgColor}`}
                                >
                                    {weapon.icon ? (
                                        <Image
                                            src={weapon.icon}
                                            alt={weapon.id}
                                            width={0}
                                            height={0}
                                            sizes="100%"
                                            priority
                                            className="object-contain w-full h-full"
                                        />
                                    ) : (
                                        <></>
                                    )}

                                    <Image
                                        alt={weapon.weaponType}
                                        src={
                                            "/images/games/icons/genshin-impact/weapon-types/" +
                                            weapon.weaponType +
                                            ".png"
                                        }
                                        width={0}
                                        height={0}
                                        sizes="100%"
                                        className="absolute right-0 bottom-1 w-7 h-7"
                                        title={
                                            GENSHIN_WEAPON[
                                                weapon.weaponType as keyof typeof GENSHIN_WEAPON
                                            ]
                                        }
                                    />
                                </div>
                            </div>
                            <div className="w-3/5 flex flex-col h-full">
                                <span className="text-xl text-electro-50 font-bold lg:text-lg bg-electro-850 w-full mb-2">
                                    {weapon.name}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
