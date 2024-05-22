import { HTTP_METHOD } from "@/types";
import {
    ExtraGenshinCharacter,
    GenshinCharacterSubstats,
    NameIconWithIdDictionary,
} from "@/types/apiResponses";
import { formatEventDuration } from "@/utils/dateUtils";
import cmsRequest from "@/utils/fetchUtils";
import { capitalizeString, getStarString } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
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

function BannerCharacterPreview(props: {
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

export default async function CharacterSlug(props: {
    params: { characterId: string };
}) {
    const { characterId } = props.params;
    let character: ExtraGenshinCharacter;
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
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 bg-electro-800 rounded inline-block items-start justify-center font-exo lg:w-[75%] sm:flex">
            <div className="flex-1 flex flex-col justify-center text-electro-50">
                <div className="flex flex-col-reverse md:grid md:grid-cols-[70%_30%] gap-4 w-full">
                    <div
                        className="flex flex-col mt-[-50vh] md:mt-0 items-center z-[1] md:block"
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(77,63,88, 0) 0%, rgba(77,63,88,.75) 10%)",
                        }}
                    >
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
                                        className="object-scale-down"
                                    />
                                </div>
                            ) : (
                                character.element.name
                            )}
                        </div>
                        <table className="w-[80%] my-2 border-b-2 border-electro-50/20">
                            <tbody>
                                <tr>
                                    <td className="text-electro-50 text-xl text-left w-1/2">
                                        Birthday
                                    </td>
                                    <td className="text-electro-50 text-md">
                                        {character.birthday}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-electro-50 text-xl text-left w-1/2">
                                        Weapon Type
                                    </td>
                                    <td className="text-electro-50 text-md">
                                        {capitalizeString(character.weaponType)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-electro-50 text-xl text-left w-1/2">
                                        Level Up Stat
                                    </td>
                                    <td className="text-electro-50 text-md">
                                        {
                                            GenshinCharacterSubstats[
                                                character.substat
                                            ]
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="w-[80%] my-2 border-b-2 border-electro-50/20">
                            <caption className="text-electro-50 text-2xl text-left">
                                Character Level Up Materials
                            </caption>
                            <tbody>
                                <tr>
                                    <td className="text-electro-50 text-xl text-left w-1/2">
                                        Specialty
                                    </td>
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
                                </tr>
                                <tr>
                                    <td className="text-electro-50 text-xl text-left w-1/2">
                                        Open World Boss
                                    </td>
                                    <td className="text-electro-50 text-md">
                                        {character.boss &&
                                        character.boss.icon ? (
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
                                </tr>
                                <tr>
                                    <td className="text-electro-50 text-xl text-left w-1/2">
                                        Gem
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
                            </tbody>
                        </table>

                        <table className="w-[80%] my-2">
                            <caption className="text-electro-50 text-2xl text-left">
                                Talent Lvl Up Materials
                            </caption>
                            <tbody>
                                <tr>
                                    <td className="text-electro-50 text-xl text-left w-1/2">
                                        Books
                                    </td>
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
                                </tr>
                                <tr>
                                    <td className="text-electro-50 text-xl text-left w-1/2">
                                        Weekly Boss
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
                                </tr>
                                <tr>
                                    <td className="text-electro-50 text-xl text-left w-1/2">
                                        Mob Drop
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
                            </tbody>
                        </table>
                    </div>

                    <div className="w-full overflow-clip h-[calc(100vh-4rem)] max-h-[600px] z-0 ">
                        {character.splash ? (
                            <Image
                                src={character.splash}
                                alt={character.id + "_splash"}
                                width={0}
                                height={0}
                                priority
                                sizes="100%"
                                className="h-[calc(100vh-4rem)] max-h-[600px] object-cover w-auto mx-auto"
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>

                <div>
                    <table className="w-full my-2 border-separate border-spacing-y-2 bg-electro-900 p-2 rounded">
                        <caption className="text-electro-50 text-2xl text-left">
                            Banners
                        </caption>
                        <thead>
                            <tr>
                                <th className="text-electro-50 text-left text-lg border-b-2 border-electro-50/20">
                                    Characters
                                </th>
                                <th className="text-electro-50 text-left text-lg border-b-2 border-electro-50/20">
                                    Duration
                                </th>
                                <th className="text-electro-50 text-left text-lg border-b-2 border-electro-50/20">
                                    Version
                                </th>
                            </tr>
                        </thead>
                        <tbody className="gap-2">
                            {character.events.map((event) => {
                                const { fiveStar1, fiveStar2 } =
                                    event.characters;
                                return (
                                    <tr
                                        key={event.id}
                                        className="border-b-2 border-electro-50 text-sm md:text-md "
                                    >
                                        <td className="flex flex-row gap-2 border-b-2 border-electro-50/20 align-top">
                                            <BannerCharacterPreview
                                                char={fiveStar1}
                                                rarity={5}
                                                href={`/game/genshin-impact/wiki/characters/${fiveStar1.id}`}
                                            />
                                            {fiveStar2 ? (
                                                <BannerCharacterPreview
                                                    char={fiveStar2}
                                                    rarity={5}
                                                    href={`/game/genshin-impact/wiki/characters/${fiveStar2.id}`}
                                                />
                                            ) : (
                                                <></>
                                            )}
                                            {event.characters.fourStar.map(
                                                (fourStar) => {
                                                    return (
                                                        <BannerCharacterPreview
                                                            char={fourStar}
                                                            rarity={4}
                                                            href={`/game/genshin-impact/wiki/characters/${fourStar.id}`}
                                                            key={`${event.id}-${fourStar.id}`}
                                                        />
                                                    );
                                                }
                                            )}
                                        </td>
                                        <td className="border-b-2 border-electro-50/20 align-top">
                                            {formatEventDuration(
                                                event.start,
                                                event.end
                                            )}
                                        </td>
                                        <td className="border-b-2 border-electro-50/20 align-top">
                                            {event.version}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
