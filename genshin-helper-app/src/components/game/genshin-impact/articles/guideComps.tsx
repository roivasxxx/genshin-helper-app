import { GenshinGuide } from "@/types/genshinTypes";
import ItemWithIcon from "./itemWithIcon";
import RichTextContent from "./richTextContent";

export default function GuideComps(props: { comps: GenshinGuide["comps"] }) {
    const comps = props.comps;
    return (
        <>
            <h2 className="text-xl font-bold" id="comps">
                Comps
            </h2>
            <div className="flex flex-col gap-4 w-full bg-electro-900  my-2">
                {comps.list.map((comp, index) => {
                    return (
                        <div
                            className="flex flex-col p-5 rounded"
                            key={"compsList-" + index}
                        >
                            <h3 className="text-lg font-bold">
                                {comp.compName}
                            </h3>
                            <div className="w-full flex flex-row justify-center">
                                {comp.characters.map((item, idx) => {
                                    return (
                                        <div
                                            className="w-3/12"
                                            key={`compChar-${index}-${idx}`}
                                        >
                                            <ItemWithIcon item={item} />
                                        </div>
                                    );
                                })}
                                {comp.flexElements.map((item, idx) => {
                                    return (
                                        <div
                                            className="w-3/12"
                                            key={`compElement-${index}-${idx}`}
                                        >
                                            <ItemWithIcon item={item} />
                                        </div>
                                    );
                                })}
                            </div>
                            <RichTextContent
                                keyString={`comp-description-${index}`}
                                content={comp.description}
                                className="w-full break-all"
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
