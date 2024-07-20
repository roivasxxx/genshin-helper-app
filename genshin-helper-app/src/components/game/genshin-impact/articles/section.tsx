import { ExtraSection, Section, isExtraSection } from "@/types/genshinTypes";
import RichTextContent from "./richTextContent";
import React from "react";

export default function GenshinGuideSection(props: {
    sections: (Section | ExtraSection)[];
    keyString: string;
}) {
    const { sections, keyString } = props;
    return (
        <>
            {sections.map((section, index) => {
                const prop = isExtraSection(section)
                    ? section.content
                    : section.description;
                const key = `${keyString}-section-${index}`;
                return (
                    <React.Fragment key={key}>
                        <h2>{section.title}</h2>
                        <RichTextContent content={prop} keyString={key} />
                    </React.Fragment>
                );
            })}
        </>
    );
}
