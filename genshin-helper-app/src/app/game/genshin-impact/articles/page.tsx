import ArticleOverview from "@/components/game/genshin-impact/articles/articleOverview";
import { HTTP_METHOD } from "@/types";
import { GenshinArticlePreview } from "@/types/genshinTypes";
import cmsRequest from "@/utils/fetchUtils";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Genshin articles",
};

export default async function ArticlesPage() {
    let articles: GenshinArticlePreview[] = [];
    try {
        const req = await cmsRequest({
            path: "/api/genshin-articles/getArticleOverview",
            method: HTTP_METHOD.GET,
        });
        articles = await req.json();
    } catch (error) {
        console.error("ArticlesPage could not fetch data");
    }

    return (
        <main className="w-full mt-[7rem] mx-auto p-4 my-8 bg-electro-800 rounded inline-block items-start justify-center font-exo lg:w-[75%] sm:flex">
            <div className="flex-1 flex inline-block flex-col justify-center text-electro-50">
                <h1 className="text-2xl font-bold">Genshin Impact Articles</h1>
                <ArticleOverview articles={articles} />
            </div>
        </main>
    );
}
