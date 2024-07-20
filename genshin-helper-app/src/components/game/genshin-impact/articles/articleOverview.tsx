import Arrow from "@/components/arrow";
import { GenshinArticlePreview } from "@/types/genshinTypes";
import { formatDate } from "@/utils/dateUtils";
import { isGenshinGuidePreview } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import ArticleTypeBubble from "./articleTypeBubble";

export default function ArticleOverview(props: {
    articles: GenshinArticlePreview[];
}) {
    const articles = props.articles;
    return (
        <div className="text-electro-50 w-full">
            <h1 className="text-2xl font-bold">Genshin Impact Articles</h1>
            <div className="w-full">
                {articles.map((article) => {
                    return (
                        <Link
                            href={`./articles/${article.id}`}
                            key={article.id}
                            className="w-full flex flex-row items-center justify-between p-5 rounded bg-electro-900 group hover:bg-electro-900/60 active:bg-electro-900/60"
                        >
                            <div className="flex flex-row items-center gap-2">
                                {isGenshinGuidePreview(article) &&
                                article.character.icon ? (
                                    <Image
                                        src={article.character.icon}
                                        alt={article.character.name}
                                        width={75}
                                        height={75}
                                    />
                                ) : (
                                    <></>
                                )}
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-bold">
                                        {article.title}
                                    </h3>
                                    <p>{formatDate(article.updatedAt)}</p>
                                    <ArticleTypeBubble type={article.type} />
                                </div>
                            </div>
                            <Arrow
                                size="small"
                                className="group-hover:border-electro-500 group-active:border-electro-500 mx-2"
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
