import {
    GenshinMaterial,
    GenshinMaterialLabel,
    GenshinMaterialType,
} from "@/types/apiResponses";
import MaterialShowcaseItem from "./materialShowcaseItem";

export default function MaterialShowcaseSection(props: {
    materialType: GenshinMaterialType;
    materials: GenshinMaterial[];
}) {
    const { materialType, materials } = props;
    return (
        <div className="grid grid-cols-1 gap-2">
            <h2 className="text-2xl font-bold text-left">
                {GenshinMaterialLabel[materialType]}
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
