import CharacterShowcase from "@/components/game/genshin-impact/characterShowcase";
import { HTTP_METHOD } from "@/types";
import cmsRequest from "@/utils/fetchUtils";

export const dynamic = "force-static";

export default async function GenshinRoot(props: any) {
    let characters = [];
    let elements = [];
    try {
        const result = await cmsRequest({
            path: "/api/genshin-characters/getGenshinCharacters",
            method: HTTP_METHOD.GET,
        });
        characters = await result.json();
    } catch (error) {
        return null;
    }

    try {
        const result = await cmsRequest({
            path: "/api/genshin-elements/getElements",
            method: HTTP_METHOD.GET,
        });
        elements = await result.json();
    } catch (error) {
        return null;
    }

    return (
        <main className="max-w-5xl mx-auto p-4 mt-8 bg-electro-800 rounded block sm:flex items-start justify-center font-exo">
            <div className="flex-1 flex flex-col justify-center">
                <CharacterShowcase {...{ characters, elements }} />
            </div>
        </main>
    );
}
