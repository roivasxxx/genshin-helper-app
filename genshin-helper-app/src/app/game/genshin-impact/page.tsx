import DomainItems from "@/components/game/genshin-impact/dashboard/domainItems";
import DashboardEvents from "@/components/game/genshin-impact/dashboard/events";
import { HTTP_METHOD } from "@/types";
import { GenshinDayDependentMaterial } from "@/types/apiResponses";
import cmsRequest from "@/utils/fetchUtils";

export const dynamic = "force-dynamic";

export default async function GenshinRoot(props: any) {
    let domainItems: GenshinDayDependentMaterial[] = [];
    try {
        const result = await cmsRequest({
            path: "/api/genshin-items/getDomainItems",
            method: HTTP_METHOD.GET,
        });
        domainItems = await result.json();
    } catch (error) {
        console.error("getDomainItems threw an error: ", error);
    }

    return (
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 bg-electro-800 rounded inline-block items-start justify-center text-electro-50 font-exo lg:w-[75%] sm:flex">
            <div className="flex-1 flex inline-block flex-col justify-center">
                <DomainItems items={domainItems} />
                <DashboardEvents />
            </div>
        </main>
    );
}
