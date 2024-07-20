import { GenshinGuide } from "@/types/genshinTypes";
import { formatDate } from "@/utils/dateUtils";
import GuideWeapons from "./guideWeapons";
import GuideArtifacts from "./guideArtifacts";
import GuideTeamMates from "./guideTeamMates";
import GuideComps from "./guideComps";
import GenshinGuideSection from "./section";

export default function Guide(props: { article: GenshinGuide }) {
    const article = props.article;
    return (
        <div className="text-electro-50 w-full">
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold ">{article.title}</h1>
                <h2>Last updated on {formatDate(article.updatedAt)}</h2>
            </div>
            <GuideWeapons weapons={article.weapons} />
            <GuideArtifacts artifacts={article.artifacts} />
            <GuideTeamMates teamMates={article.bestTeams} />
            <GuideComps comps={article.comps} />

            <GenshinGuideSection
                sections={article.sections}
                keyString="extras"
            />
        </div>
    );
}
