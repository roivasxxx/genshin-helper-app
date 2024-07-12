import { ExtraGenshinCharacter } from "@/types/genshinTypes";
import CharacterSkill from "./skill";
import PassiveConstellation from "./passive-constellation";

export default function SkillsAndConstellations(props: {
    character: ExtraGenshinCharacter;
    itemType: "constellations" | "skills";
}) {
    const { constellations, skills } = props.character;
    const itemType = props.itemType;
    return (
        <div className="bg-electro-800 rounded p-4 my-8">
            {itemType === "skills" ? (
                <>
                    <h2 className="text-2xl font-bold">Skills</h2>
                    <div className="flex flex-col">
                        <CharacterSkill skill={skills.combat1} />
                        <CharacterSkill skill={skills.combat2} />
                        <CharacterSkill skill={skills.combat3} />
                        {skills.combatsp ? (
                            <CharacterSkill skill={skills.combatsp} />
                        ) : (
                            <></>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold mt-4">Passives</h2>
                    <div className="flex flex-col">
                        <PassiveConstellation item={skills.passive1} />
                        <PassiveConstellation item={skills.passive2} />
                        {skills.passive3 ? (
                            <PassiveConstellation item={skills.passive3} />
                        ) : (
                            <></>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold">Constellations</h2>
                    <div className="flex flex-col">
                        <PassiveConstellation item={constellations.c1} />
                        <PassiveConstellation item={constellations.c2} />
                        <PassiveConstellation item={constellations.c3} />
                        <PassiveConstellation item={constellations.c4} />
                        <PassiveConstellation item={constellations.c5} />
                        <PassiveConstellation item={constellations.c6} />
                    </div>
                </>
            )}
        </div>
    );
}
