import Guide from "@/components/game/genshin-impact/articles/guide";
import GuideSidebar from "@/components/game/genshin-impact/articles/guideSidebar";
import { HTTP_METHOD } from "@/types";
import { GenshinGuide } from "@/types/genshinTypes";
import cmsRequest from "@/utils/fetchUtils";
import { Metadata, ResolvingMetadata } from "next";

export const dynamic = "force-static";

type Props = {
    params: { articleId: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.articleId;
    let title = "Article";
    try {
        const data = await cmsRequest({
            path: `/api/genshin-articles/getArticleTitle?id=${id}&skipRateLimitKey=${process.env.SKIP_RATE_LIMIT_KEY}`,
            method: HTTP_METHOD.GET,
        });
        title = await data.text();
    } catch (error) {
        console.error("ArticleSlug - generateMetadata threw an error", error);
    }
    return {
        title: title,
    };
}

export async function generateStaticParams() {
    let articleIds = [];
    try {
        const result = await cmsRequest({
            path: "/api/genshin-articles/getArticleIds",
            method: HTTP_METHOD.GET,
        });
        articleIds = await result.json();
    } catch (error) {
        console.error(
            "ArticleSlug - generateStaticParams threw an error",
            error
        );
    }
    return articleIds;
}

export default async function ArticleSlug(props: {
    params: { articleId: string };
}) {
    const { articleId } = props.params;
    let article: GenshinGuide;
    try {
        const result = await cmsRequest({
            path: `/api/genshin-articles/getArticle?id=${articleId}&skipRateLimitKey=${process.env.SKIP_RATE_LIMIT_KEY}`,
            method: HTTP_METHOD.GET,
        });
        article = await result.json();
    } catch (error) {
        console.error("ArticleSlug - threw an error", error);
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row md:items-start">
            {/* Sidebar */}
            <GuideSidebar article={article} />

            {/* Main Content */}
            <main className="w-full mt-[7rem] mx-auto p-4 my-8 bg-electro-800 rounded inline-block items-start justify-center font-exo lg:w-[75%] sm:flex lg:order-none order-1">
                <div className="flex-1 flex inline-block flex-col justify-center">
                    <Guide article={article} />
                </div>
            </main>
        </div>
    );
}
