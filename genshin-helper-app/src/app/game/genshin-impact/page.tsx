import cmsRequest from "@/utils/fetchUtils";

export const dynamic = "force-static";

export default async function GenshinRoot(props: any) {
    try {
        await cmsRequest({
            path: "/api/genshin-characters/getGenshinCharacter",
            method: "GET",
        });
    } catch (error) {}

    return (
        <main>
            <div className="flex mx-5 bg-gray-100"></div>
        </main>
    );
}
