import DomainItems from "@/components/game/genshin-impact/dashboard/domainItems";
import DashboardEvents from "@/components/game/genshin-impact/dashboard/events";
import { HTTP_METHOD } from "@/types";
import { GenshinDayDependentMaterial } from "@/types/genshinTypes";
import cmsRequest from "@/utils/fetchUtils";

export const dynamic = "force-dynamic";

export default async function GenshinRoot(props: any) {
    let domainItems: {
        books: GenshinDayDependentMaterial[][];
        weapons: GenshinDayDependentMaterial[][];
    } = {
        books: [],
        weapons: [],
    };
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
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 rounded items-start justify-center text-electro-50 font-exo lg:w-[75%] sm:flex">
            <div className="w-full flex flex-col justify-center">
                <DomainItems items={domainItems} />
                <DashboardEvents />
            </div>
        </main>
    );
}
