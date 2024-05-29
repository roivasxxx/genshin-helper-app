import { GenshinMaterialType, GenshinMaterial } from "@/types/apiResponses";
import MaterialShowcaseSection from "./materialShowcaseSection";

export default function MaterialShowcase(props: {
    materials: GenshinMaterial[];
}) {
    const sections: { [K in GenshinMaterialType]: GenshinMaterial[] } = {
        weaponMat: [],
        book: [],
        bossDrop: [],
        mobDrop: [],
        gem: [],
        specialty: [],
        trounceDrop: [],
    };
    props.materials.forEach((material) => {
        sections[material.type].push(material);
    });

    return (
        <>
            <div>
                <MaterialShowcaseSection
                    materialType="weaponMat"
                    materials={sections.weaponMat}
                />
                <MaterialShowcaseSection
                    materialType="book"
                    materials={sections.book}
                />
            </div>
        </>
    );
}
