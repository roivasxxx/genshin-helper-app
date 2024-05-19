import { HTTP_METHOD } from "@/types";
import { GenshinCharactersResponse } from "@/types/apiResponses";
import cmsRequest from "@/utils/fetchUtils";
import { capitalizeString, getStarString } from "@/utils/utils";
import Image from "next/image";
import React from "react";

export async function generateStaticParams() {
    let characters = [];
    try {
        const result = await cmsRequest({
            path: "/api/genshin-characters/getGenshinCharacters",
            method: HTTP_METHOD.GET,
        });
        characters = await result.json();
    } catch (error) {
        console.error(
            "CharacterSlug - generateStaticParams threw an error",
            error
        );
    }
    return characters.map((el: any) => {
        return { characterId: el.id };
    });
}

export default async function CharacterSlug(props: {
    params: { characterId: string };
}) {
    const { characterId } = props.params;
    let character: GenshinCharactersResponse;
    try {
        const result = await cmsRequest({
            path: `/api/genshin-characters/getGenshinCharacter?id=${characterId}&skipRateLimitKey=${process.env.SKIP_RATE_LIMIT_KEY}`,
            method: HTTP_METHOD.GET,
        });
        character = await result.json();
        if (character.id.includes("traveler")) {
            // traveler uses all books for specific region - element
            // add extra 2 empty ones for table mapping
            character.books = [
                character.books.shift() || { name: "", icon: "" },
                { name: "", icon: "" },
                { name: "", icon: "" },
                ...character.books,
            ];
        }
    } catch (error) {
        console.error("CharacterSlug - threw an error", error);
        return null;
    }

    return (
        <main className="w-full mx-auto p-4 my-8 bg-electro-800 rounded inline-block items-start justify-center font-exo lg:w-[75%] sm:flex">
            <div className="flex-1 flex flex-col justify-center text-electro-50">
                <div className="grid grid-cols-[80%_20%] gap-4 w-full">
                    <div className="w-9/12">
                        <h1 className="text-5xl">{character.name}</h1>
                        <div className="flex flex-row items-center mt-2">
                            <span className="text-electro-5star-from text-2xl">
                                {getStarString(character.rarity)}
                            </span>
                            {character.element.icon ? (
                                <div className="relative size-10 mx-2">
                                    <Image
                                        alt={character.element.name}
                                        src={character.element.icon}
                                        fill={true}
                                        sizes="100%"
                                        objectFit="scale-down"
                                    />
                                </div>
                            ) : (
                                character.element.name
                            )}
                        </div>
                        <p className="text-electro-50 text-2xl">
                            {capitalizeString(character.weaponType)}
                        </p>
                        <p className="text-electro-50 text-2xl">
                            Level Up Stat {character.substat}
                        </p>

                        <table className="w-full my-2">
                            <caption className="text-electro-50 text-2xl text-left">
                                Character Level Up Materials
                            </caption>
                            <thead>
                                <tr>
                                    <th className="text-electro-50 text-xl text-left">
                                        Specialty
                                    </th>
                                    <th className="text-electro-50 text-xl text-left">
                                        Open World Boss
                                    </th>
                                    <th className="text-electro-50 text-xl text-left">
                                        Gem
                                    </th>
                                </tr>
                            </thead>
                            <tr>
                                <td className="text-electro-50 text-md flex">
                                    {character.specialty.icon ? (
                                        <Image
                                            src={character.specialty.icon}
                                            alt={character.specialty.name}
                                            height={40}
                                            width={40}
                                            title={character.specialty.name}
                                        />
                                    ) : (
                                        character.specialty.name
                                    )}
                                </td>
                                <td className="text-electro-50 text-md">
                                    {character.boss && character.boss.icon ? (
                                        <Image
                                            src={character.boss.icon}
                                            alt={character.boss.name}
                                            height={40}
                                            width={40}
                                            title={character.boss.name}
                                        />
                                    ) : (
                                        // traveler does not need any boss drop
                                        <></>
                                    )}
                                </td>
                                <td className="text-electro-50 text-md">
                                    {character.gem.icon ? (
                                        <Image
                                            src={character.gem.icon}
                                            alt={character.gem.name}
                                            height={40}
                                            width={40}
                                            title={character.gem.name}
                                        />
                                    ) : (
                                        character.gem.name
                                    )}
                                </td>
                            </tr>
                        </table>

                        <table className="w-full my-2">
                            <caption className="text-electro-50 text-2xl text-left border-b-2 border-electro-50">
                                Talent Lvl Up Materials
                            </caption>
                            <thead>
                                <tr>
                                    <th className="text-electro-50 text-xl text-left">
                                        Books
                                    </th>
                                    <th className="text-electro-50 text-xl text-left">
                                        Weekly Boss
                                    </th>
                                    <th className="text-electro-50 text-xl text-left">
                                        Mob Drop
                                    </th>
                                </tr>
                            </thead>
                            <tr>
                                <td className="text-electro-50 text-md grid grid-cols-3 align-top">
                                    {character.books.map((book) => {
                                        return (
                                            <span
                                                key={book.name}
                                                title={book.name}
                                            >
                                                {book.icon ? (
                                                    <Image
                                                        src={book.icon}
                                                        alt={book.name}
                                                        height={40}
                                                        width={40}
                                                    />
                                                ) : (
                                                    book.name
                                                )}
                                            </span>
                                        );
                                    })}
                                </td>
                                <td className="text-electro-50 text-md align-top">
                                    {character.trounce.icon ? (
                                        <Image
                                            src={character.trounce.icon}
                                            alt={character.trounce.name}
                                            height={40}
                                            width={40}
                                            title={character.trounce.name}
                                        />
                                    ) : (
                                        character.trounce.name
                                    )}
                                </td>
                                <td className="text-electro-50 text-md align-top">
                                    {character.talent.icon ? (
                                        <Image
                                            src={character.talent.icon}
                                            alt={character.talent.name}
                                            height={40}
                                            width={40}
                                            title={character.talent.name}
                                        />
                                    ) : (
                                        character.talent.name
                                    )}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="w-3/12">
                        {/** PUT SPLASH HERE */}
                        {/* <div className="relative size-24">
                            <Image
                                src={character.icon}
                                alt={character.id}
                                fill={true}
                                sizes="100%"
                                objectFit="scale-down"
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        </main>
    );
}
