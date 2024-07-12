import { GenshinMaterial, GENSHIN_MATERIAL_TYPE } from "@/types/genshinTypes";
import MaterialShowcaseItem from "./materialShowcaseItem";
import { GENSHIN_MATERIAL_TEXT } from "@/utils/constants";

export default function MaterialShowcaseSection(props: {
    materialType: GENSHIN_MATERIAL_TYPE;
    materials: GenshinMaterial[];
}) {
    const { materialType, materials } = props;
    return (
        <div className="grid grid-cols-1 gap-2">
            <h2 className="text-2xl font-bold text-left">
                {GENSHIN_MATERIAL_TEXT[materialType]}
            </h2>
            {materials.map((material) => (
                <MaterialShowcaseItem
                    material={material}
                    key={`${materialType}-${material.id}`}
                />
            ))}
        </div>
    );
}
