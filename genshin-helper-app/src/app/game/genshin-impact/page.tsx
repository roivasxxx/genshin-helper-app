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
        <main className="container mx-auto p-4 mt-8 bg-electro-800 rounded flex flex-1 items-start">
            <div className="flex-1">
                <CharacterShowcase {...{ characters, elements }} />
            </div>
        </main>
    );
}
