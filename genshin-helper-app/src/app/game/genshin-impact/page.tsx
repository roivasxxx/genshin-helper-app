import ArticleOverview from "@/components/game/genshin-impact/articles/articleOverview";
import DomainItems from "@/components/game/genshin-impact/dashboard/domainItems";
import DashboardEvents from "@/components/game/genshin-impact/dashboard/events";
import { HTTP_METHOD } from "@/types";
import {
    GenshinArticlePreview,
    GenshinDayDependentMaterial,
} from "@/types/genshinTypes";
import cmsRequest from "@/utils/fetchUtils";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Genshin Impact",
};

export default async function GenshinRoot(props: any) {
    let domainItems: {
        books: GenshinDayDependentMaterial[][];
        weapons: GenshinDayDependentMaterial[][];
    } = {
        books: [],
        weapons: [],
    };
    let articles: GenshinArticlePreview[] = [];
    try {
        const result = await cmsRequest({
            path: "/api/genshin-items/getDomainItems",
            method: HTTP_METHOD.GET,
        });
        domainItems = await result.json();
    } catch (error) {
        console.error("getDomainItems threw an error: ", error);
    }
    try {
        const req = await cmsRequest({
            path: "/api/genshin-articles/getRecentArticles",
            method: HTTP_METHOD.GET,
        });
        articles = await req.json();
    } catch (error) {
        console.error("ArticlesPage could not fetch data");
    }

    return (
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 rounded items-start justify-center text-electro-50 font-exo lg:w-[75%] sm:flex">
            {" "}
            <div className="w-full flex flex-col justify-center">
                <DomainItems items={domainItems} />
                <DashboardEvents />
                <div className="w-full bg-electro-800 rounded p-4 my-8">
                    <h1 className="w-full text-3xl py-2">Recent Articles</h1>
                    <ArticleOverview articles={articles} addStatus />
                </div>
            </div>
        </main>
    );
}
