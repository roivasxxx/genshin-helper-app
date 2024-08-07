import ArtifactsShowcase from "@/components/game/genshin-impact/artifacts/artifactShowcase";
import { HTTP_METHOD } from "@/types";
import { GenshinArtifact } from "@/types/genshinTypes";
import cmsRequest from "@/utils/fetchUtils";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Artifacts",
};

export default async function ArtifactsPage() {
    let artifacts: GenshinArtifact[] = [];
    try {
        const result = await cmsRequest({
            path: "/api/genshin-artifacts/getArtifacts",
            method: HTTP_METHOD.GET,
        });
        artifacts = await result.json();
    } catch (error) {
        return null;
    }

    return (
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 700/90 rounded inline-block items-start justify-center text-electro-50 font-exo lg:w-[75%] sm:flex">
            <div className="flex-1 flex inline-block flex-col justify-center">
                <ArtifactsShowcase artifacts={artifacts} />
            </div>
        </main>
    );
}
