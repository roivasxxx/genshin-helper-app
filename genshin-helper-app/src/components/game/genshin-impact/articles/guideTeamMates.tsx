import { GenshinGuide } from "@/types/genshinTypes";
import ItemWithIcon from "./itemWithIcon";
import RichTextContent from "./richTextContent";

export default function GuideTeamMates(props: {
    teamMates: GenshinGuide["bestTeams"];
}) {
    const teamMates = props.teamMates;
    return (
        <>
            <h2 className="text-xl font-bold" id="team-mates">
                Best Team Mates
            </h2>
            <div className="flex flex-col gap-4 w-full bg-electro-900  my-2">
                {teamMates.list.map((teamMate, index) => {
                    return (
                        <div
                            className="flex flex-row p-5 rounded"
                            key={"teamMatesList-" + index}
                        >
                            <div className="w-3/12">
                                <ItemWithIcon item={teamMate.character} />
                            </div>
                            <RichTextContent
                                keyString={`team-mates-description-${index}`}
                                content={teamMate.description}
                                className="w-9/12 text-center break-all m-auto"
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
