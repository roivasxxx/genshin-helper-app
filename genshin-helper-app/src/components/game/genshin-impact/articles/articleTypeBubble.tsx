import { GENSHIN_ARTICLE_TYPE } from "@/types/genshinTypes";
import { ARTICLE_KEY_VALUES } from "@/utils/constants";

export default function ArticleTypeBubble(props: {
    type: GENSHIN_ARTICLE_TYPE;
}) {
    const type = props.type;
    const content = ARTICLE_KEY_VALUES.articleType[type];
    return (
        <span className="bg-electro-5star-from/70 p-2 rounded text-center font-bold group-hover:bg-electro-5star-from group-active:bg-electro-5star-from">
            {content.text}
        </span>
    );
}
