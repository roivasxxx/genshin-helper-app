import { HTTP_METHOD } from "@/types";
import cmsRequest from "@/utils/fetchUtils";

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
    let character;
    try {
        const result = await cmsRequest({
            path: `/api/genshin-characters/getGenshinCharacter?id=${characterId}&skipRateLimitKey=${process.env.SKIP_RATE_LIMIT_KEY}`,
            method: HTTP_METHOD.GET,
        });
        character = await result.json();
    } catch (error) {
        console.error("CharacterSlug - threw an error", error);
        return null;
    }

    return (
        <main className="max-w-5xl mx-auto p-4 my-8 bg-electro-800 rounded block sm:flex items-start justify-center font-exo">
            <div className="flex-1 flex flex-col justify-center">
                {character.name}
                {character.element.name}
                {character.rarity}
            </div>
        </main>
    );
}
