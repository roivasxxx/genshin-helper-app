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
            <div className="w-full flex flex-col md:flex-row items-center justify-between">
                {/* filter */}
                <div className="flex flex-wrap flex-row items-center justify-center gap-2">
                    {elements.map((element) => {
                        const selected = filter.element === element.name;
                        return (
                            <ShowcaseClickable
                                onClick={(_) =>
                                    filterChange("element", element.name)
                                }
                                className={`flex items-center justify-center w-10 h-10 ${
                                    selected
                                        ? "bg-electro-600"
                                        : "bg-electro-600/50"
                                } rounded text-electro-50 group hover:bg-electro-300 hover:text-electro-500`}
                            >
                                <div className="relative w-4/5 h-4/5">
                                    {element.icon ? (
                                        <Image
                                            src={element.icon}
                                            fill={true}
                                            objectFit="cover"
                                            priority
                                            alt={element.name}
                                            className={`${
                                                selected ? "" : "opacity-50"
                                            }`}
                                        />
                                    ) : (
                                        element.name
                                    )}
                                </div>
                            </ShowcaseClickable>
                        );
                    })}
                </div>
                <div className="flex flex-wrap flex-row items-center justify-center gap-2">
                    {Object.keys(GENSHIN_WEAPONS).map((weapon) => {
                        const key =
                            GENSHIN_WEAPONS[
                                weapon as keyof typeof GENSHIN_WEAPONS
                            ];
                        const selected = filter.weapon === key;
                        return (
                            <ShowcaseClickable
                                onClick={(_) => filterChange("weapon", key)}
                                className={`flex items-center justify-center w-10 h-10 ${
                                    selected
                                        ? "bg-electro-600"
                                        : "bg-electro-600/50"
                                } rounded text-electro-50 group hover:bg-electro-300 hover:text-electro-500`}
                            >
                                <div className="relative w-4/5 h-4/5">
                                    <Image
                                        src={
                                            "/images/games/icons/genshin-impact/weapon-types/" +
                                            key +
                                            ".png"
                                        }
                                        fill={true}
                                        objectFit="cover"
                                        priority
                                        alt={key}
                                        className={`${
                                            selected ? "" : "opacity-50"
                                        }`}
                                    />
                                </div>
                            </ShowcaseClickable>
                        );
                    })}
                </div>
                <div className="flex flex-wrap flex-row items-center justify-center gap-2">
                    <ShowcaseClickable
                        onClick={(_) => {
                            filterChange("rarity", "4");
                        }}
                        className={`flex items-center justify-center w-10 h-10 ${
                            filter.rarity === "4"
                                ? "bg-electro-600 text-electro-50"
                                : "bg-electro-600/50 text-electro-50/50"
                        } rounded group hover:bg-electro-300 hover:text-electro-50`}
                    >
                        {`4 ${STAR_SYMBOL}`}
                    </ShowcaseClickable>
                    <ShowcaseClickable
                        onClick={(_) => {
                            filterChange("rarity", "5");
                        }}
                        className={`flex items-center justify-center w-10 h-10 ${
                            filter.rarity === "5"
                                ? "bg-electro-600 text-electro-50"
                                : "bg-electro-600/50 text-electro-50/50"
                        } rounded group hover:bg-electro-300 hover:text-electro-50`}
                    >
                        {`5 ${STAR_SYMBOL}`}
                    </ShowcaseClickable>
                </div>
                <button
                    onClick={() => {
                        setFilter({ weapon: "", element: "", rarity: "" });
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-red-600 rounded group hover:bg-red-800"
                >
                    <CloseIcon className="stroke-electro-50 w-4 h-4 group-hover:stroke-electro-500" />
                </button>
            </div>
            <div>
                {/* filtered characters */}
                {filteredData.map((character) => {
                    return (
                        <div key={"preview-" + character.id}>
                            {character.name}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
