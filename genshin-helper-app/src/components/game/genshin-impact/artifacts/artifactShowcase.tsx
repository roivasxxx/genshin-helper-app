import { GenshinArtifact } from "@/types/apiResponses";
import ArtifactShowcaseElement from "./artifactShowcaseElement";

export default function ArtifactsShowcase(props: {
    artifacts: GenshinArtifact[];
}) {
    const artifacts = props.artifacts;

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
                {artifacts.map((artifact) => (
                    <ArtifactShowcaseElement
                        key={artifact.id}
                        artifact={artifact}
                    />
                ))}
            </div>
        </>
    );
}
