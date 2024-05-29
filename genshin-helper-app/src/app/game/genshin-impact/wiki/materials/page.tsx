import MaterialShowcase from "@/components/game/genshin-impact/materials/materialShowcase";
import { HTTP_METHOD } from "@/types";
import { GenshinMaterial } from "@/types/apiResponses";
import cmsRequest from "@/utils/fetchUtils";

export const dynamic = "force-static";

export default async function MaterialsPage() {
    let materials: GenshinMaterial[] = [];
    try {
        const result = await cmsRequest({
            path: "/api/genshin-items/getItems",
            method: HTTP_METHOD.GET,
        });
        materials = await result.json();
    } catch (error) {
        return null;
    }

    return (
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 rounded inline-block items-start justify-center text-electro-50 font-exo lg:w-[75%] sm:flex">
            <div className="flex-1 flex inline-block flex-col justify-center">
                <MaterialShowcase materials={materials} />
            </div>
        </main>
    );
}
