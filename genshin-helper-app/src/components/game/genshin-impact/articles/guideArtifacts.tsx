import { GenshinGuide } from "@/types/genshinTypes";
import GenshinGuideSection from "./section";
import RichTextContent from "./richTextContent";
import ItemWithIcon from "./itemWithIcon";

export default function GuideArtifacts(props: {
    artifacts: GenshinGuide["artifacts"];
}) {
    const artifacts = props.artifacts;
    return (
        <>
            <h2 className="text-xl font-bold" id="artifacts">
                Artifacts
            </h2>
            <GenshinGuideSection
                sections={artifacts.sections}
                keyString="artifacts"
            />
            <div className="flex flex-col gap-4 w-full bg-electro-900  my-2">
                {artifacts.list.map((artifact, index) => {
                    return (
                        <div
                            className="flex flex-row p-5 rounded"
                            key={"artifactsList-" + index}
                        >
                            <div className="w-3/12">
                                {artifact.artifacts.map((item, _id) => {
                                    return (
                                        <ItemWithIcon
                                            item={item}
                                            key={`artifact-${index}-${_id}`}
                                        />
                                    );
                                })}
                            </div>
                            <RichTextContent
                                keyString={`artifact-description-${index}`}
                                content={artifact.description}
                                className="w-9/12 text-center break-all m-auto"
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
