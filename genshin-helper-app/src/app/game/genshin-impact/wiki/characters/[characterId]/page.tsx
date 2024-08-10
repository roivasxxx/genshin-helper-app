import CharacterBanners from "@/components/game/genshin-impact/characters/characterPage/characterBanners";
import CharacterInfo from "@/components/game/genshin-impact/characters/characterPage/characterInfo";
import SkillsAndConstellations from "@/components/game/genshin-impact/characters/characterPage/skillsAndConstellations";
import { HTTP_METHOD } from "@/types";
import { ExtraGenshinCharacter } from "@/types/genshinTypes";
import cmsRequest from "@/utils/fetchUtils";
import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import ImageWithLoader from "@/components/imageWithLoader";

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

type Props = {
    params: { characterId: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.characterId;
    let title = "Character";
    try {
        const data = await cmsRequest({
            path: `/api/genshin-characters/getCharacterName?id=${id}&skipRateLimitKey=${process.env.SKIP_RATE_LIMIT_KEY}`,
            method: HTTP_METHOD.GET,
        });
        title = await data.text();
    } catch (error) {
        console.error("CharacterSlug - generateMetadata threw an error", error);
    }
    return {
        title: title,
    };
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
        <main className="w-full mt-[7rem] mx-auto  inline-block items-start justify-center font-exo lg:w-[75%] sm:flex">
            <div className="flex-1 flex flex-col justify-center text-electro-50">
                <div className="flex flex-col-reverse gap-4 w-full bg-electro-800 rounded p-4 my-8 md:grid md:grid-cols-[70%_30%]">
                    <CharacterInfo character={character} />
                    <div className="w-full overflow-clip h-[calc(100vh-4rem)] max-h-[600px] z-0 ">
                        {character.splash ? (
                            <ImageWithLoader
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

                <CharacterBanners character={character} />
                <SkillsAndConstellations
                    character={character}
                    itemType="skills"
                />
                <SkillsAndConstellations
                    character={character}
                    itemType="constellations"
                />
            </div>
        </main>
    );
}
