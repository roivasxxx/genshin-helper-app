import { NameIconWithDescriptionDictionary } from "@/types/apiResponses";
import Image from "next/image";

export default function CharacterSkill(props: {
    skill: NameIconWithDescriptionDictionary;
}) {
    const skill = props.skill;
    return (
        <div className="mt-2 border-b-2 p-2">
            <div className="flex flex-row items-center">
                <div className="w-16 flex-shrink-0 md:mr-2">
                    {skill.icon ? (
                        <Image
                            alt={skill.name}
                            src={skill.icon}
                            height={0}
                            width={0}
                            sizes="100%"
                            className="h-10 w-auto md:h-16"
                        />
                    ) : (
                        <></>
                    )}
                </div>
                <span className="text-lg">{skill.name}</span>
            </div>
            <span dangerouslySetInnerHTML={{ __html: skill.description }} />
        </div>
    );
}
