import Arrow from "@/components/arrow";
import { GenshinArticlePreview } from "@/types/genshinTypes";
import { formatDate } from "@/utils/dateUtils";
import { isGenshinGuidePreview } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { GENSHIN_ARTICLE_TYPE } from "@/types/genshinTypes";
import { ARTICLE_KEY_VALUES } from "@/utils/constants";

function Bubble(props: { text: string; className: string }) {
    const { text, className } = props;
    return <span className={className}>{text}</span>;
}

export default function ArticleOverview(props: {
    articles: GenshinArticlePreview[];
    addStatus?: boolean;
}) {
    const { articles, addStatus } = props;
    return (
        <div>
            {articles.map((article) => {
                return (
                    <Link
                        href={`/game/genshin-impact/articles/${article.id}`}
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
                                <div className="flex items-center flex-row gap-1">
                                    <Bubble
                                        text={
                                            ARTICLE_KEY_VALUES.articleType[
                                                article.type
                                            ].text
                                        }
                                        className="bg-electro-4star-from/70 p-2 rounded text-center font-bold group-hover:bg-electro-4star-from group-active:bg-electro-4star-from"
                                    />
                                    {addStatus ? (
                                        <Bubble
                                            text={
                                                ARTICLE_KEY_VALUES
                                                    .articleStatus[
                                                    article.status
                                                ].text
                                            }
                                            className="bg-electro-5star-from/70 p-2 rounded text-center font-bold group-hover:bg-electro-5star-from group-active:bg-electro-5star-from"
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </div>
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
    );
}
