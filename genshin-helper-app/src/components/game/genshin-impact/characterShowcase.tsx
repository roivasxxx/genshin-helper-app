"use client";

import {
    GenshinCharactersResponse,
    GenshinElementsResponse,
} from "@/types/apiResponses";
import { GENSHIN_WEAPONS, STAR_SYMBOL } from "@/utils/constants";
import ShowcaseClickable from "./showcaseClickable";
import { useDeferredValue, useMemo, useState } from "react";
import CloseIcon from "@/components/closeIcon";
import Image from "next/image";
import { capitalizeString } from "@/utils/utils";
import Link from "next/link";

export default function CharacterShowcase(props: {
    characters: GenshinCharactersResponse[];
    elements: GenshinElementsResponse[];
}) {
    const { characters, elements } = props;

    const [filter, setFilter] = useState({
        weapon: "",
        element: "",
        rarity: "",
    });
    const deferredFilter = useDeferredValue(filter);

    const filteredData = useMemo(() => {
        return characters.filter((item) => {
            // If no filter is present, include all items
            if (
                !deferredFilter.weapon &&
                !deferredFilter.element &&
                !deferredFilter.rarity
            ) {
                return true;
            }

            const matchesWeapon =
                !deferredFilter.weapon ||
                deferredFilter.weapon === item.weaponType;

            const matchesElement =
                !deferredFilter.element ||
                deferredFilter.element === item.element.name;

            const matchesRarity =
                !deferredFilter.rarity ||
                deferredFilter.rarity === String(item.rarity);

            return matchesWeapon && matchesElement && matchesRarity;
        });
    }, [characters, deferredFilter]);

    const filterChange = (property: keyof typeof filter, value: string) => {
        setFilter({
            ...filter,
            [property]: value === filter[property] ? "" : value,
        });
    };

    return (
        <>
            <div className="w-full min-h-14 grid grid-cols-7 gap-2 xl:grid-cols-15 place-items-center my-2">
                {elements.map((element) => {
                    const selected = filter.element === element.name;
                    return (
                        <ShowcaseClickable
                            key={"element-" + element.name}
                            onClick={() =>
                                filterChange("element", element.name)
                            }
                            className={`${
                                selected
                                    ? "bg-electro-600"
                                    : "bg-electro-600/50"
                            }`}
                            title={capitalizeString(element.name)}
                        >
                            {element.icon ? (
                                <Image
                                    src={element.icon}
                                    width={40}
                                    height={40}
                                    priority
                                    alt={element.name}
                                    className={`${
                                        selected ? "" : "opacity-50"
                                    }`}
                                />
                            ) : (
                                element.name
                            )}
                        </ShowcaseClickable>
                    );
                })}

                {Object.keys(GENSHIN_WEAPONS).map((weapon) => {
                    const key =
                        GENSHIN_WEAPONS[weapon as keyof typeof GENSHIN_WEAPONS];
                    const selected = filter.weapon === key;
                    return (
                        <ShowcaseClickable
                            key={"weapon-" + key}
                            onClick={() => filterChange("weapon", key)}
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
                        setFilter({ weapon: "", element: "", rarity: "" });
                    }}
                    className="flex col-span-full items-center justify-center w-full h-full min-h-10 xl:col-span-1 bg-red-600 rounded group hover:bg-red-800"
                    title="Clear filters"
                >
                    <CloseIcon className="stroke-electro-50 w-4 h-4 group-hover:stroke-electro-500" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {/* filtered characters */}
                {filteredData.map((character) => {
                    return (
                        <Link
                            href={`/game/genshin-impact/wiki/characters/${character.id}`}
                            key={"preview-" + character.id}
                            className={`h-28 flex p-2 rounded bg-electro-850 text-lg`}
                        >
                            <div className="w-2/5 flex justify-center">
                                <div
                                    className={`relative w-4/5 h-full rounded p-2 ${
                                        character.rarity === 4
                                            ? "bg-electro-4star-from/50"
                                            : "bg-electro-5star-from/50"
                                    }`}
                                >
                                    <Image
                                        src={character.icon}
                                        alt={character.id}
                                        fill={true}
                                        sizes="100%"
                                        priority
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <div className="w-3/5 ">
                                <span className="grid text-electro-50 bold bg-electro-850 w-full h-[20%] mb-2">
                                    {character.name}
                                </span>
                                <div className="flex flex-row items-center">
                                    <div className="relative w-9 h-9">
                                        {character.element.icon ? (
                                            <Image
                                                alt={character.element.name}
                                                src={character.element.icon}
                                                fill={true}
                                                sizes="100%"
                                                priority
                                                className="object-contain"
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <div className="relative w-9 h-9">
                                        <Image
                                            alt={character.weaponType}
                                            src={
                                                "/images/games/icons/genshin-impact/weapon-types/" +
                                                character.weaponType +
                                                ".png"
                                            }
                                            fill={true}
                                            sizes="100%"
                                            priority
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
