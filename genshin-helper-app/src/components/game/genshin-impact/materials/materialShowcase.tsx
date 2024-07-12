"use client";
import {
    GENSHIN_MATERIAL_TYPE,
    GenshinMaterial,
    GENSHIN_MATERIAL_TEXT,
} from "@/types/genshinTypes";
import MaterialShowcaseSection from "./materialShowcaseSection";
import { useMemo, useState } from "react";
import Image from "next/image";

function MaterialTypeItem(props: {
    type: GENSHIN_MATERIAL_TYPE;
    onClick: () => void;
    selectedType: GENSHIN_MATERIAL_TYPE;
}) {
    return (
        <button
            className={`w-full flex justify-center cursor-pointer rounded bg-electro-850 hover:bg-electro-700 ${
                props.selectedType === props.type ? "bg-electro-700" : ""
            }`}
            title={GENSHIN_MATERIAL_TEXT[props.type]}
            onClick={props.onClick}
        >
            <Image
                src={`/images/games/icons/genshin-impact/material-types/${props.type}.png`}
                width={60}
                height={60}
                alt={GENSHIN_MATERIAL_TEXT[props.type]}
                sizes="100%"
            />
        </button>
    );
}

export default function MaterialShowcase(props: {
    materials: GenshinMaterial[];
}) {
    const [selectedKey, setSelectedKey] = useState<GENSHIN_MATERIAL_TYPE>(
        GENSHIN_MATERIAL_TYPE.WEAPON_MAT
    );

    const memodSections = useMemo(() => {
        const sections: { [K in GENSHIN_MATERIAL_TYPE]: GenshinMaterial[] } = {
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
        return sections;
    }, []);

    return (
        <>
            <div className="bg-electro-800 p-4 rounded mb-4">
                <div className="grid grid-cols-7 gap-2 justify-center p-2">
                    <MaterialTypeItem
                        type={GENSHIN_MATERIAL_TYPE.WEAPON_MAT}
                        onClick={() =>
                            setSelectedKey(GENSHIN_MATERIAL_TYPE.WEAPON_MAT)
                        }
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type={GENSHIN_MATERIAL_TYPE.BOOK}
                        onClick={() =>
                            setSelectedKey(GENSHIN_MATERIAL_TYPE.BOOK)
                        }
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type={GENSHIN_MATERIAL_TYPE.MOB_DROP}
                        onClick={() =>
                            setSelectedKey(GENSHIN_MATERIAL_TYPE.MOB_DROP)
                        }
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type={GENSHIN_MATERIAL_TYPE.BOSS_DROP}
                        onClick={() =>
                            setSelectedKey(GENSHIN_MATERIAL_TYPE.BOSS_DROP)
                        }
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type={GENSHIN_MATERIAL_TYPE.SPECIALTY}
                        onClick={() =>
                            setSelectedKey(GENSHIN_MATERIAL_TYPE.SPECIALTY)
                        }
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type={GENSHIN_MATERIAL_TYPE.TROUNCE_DROP}
                        onClick={() =>
                            setSelectedKey(GENSHIN_MATERIAL_TYPE.TROUNCE_DROP)
                        }
                        selectedType={selectedKey}
                    />
                    <MaterialTypeItem
                        type={GENSHIN_MATERIAL_TYPE.GEM}
                        onClick={() =>
                            setSelectedKey(GENSHIN_MATERIAL_TYPE.GEM)
                        }
                        selectedType={selectedKey}
                    />
                </div>
                <MaterialShowcaseSection
                    materialType={selectedKey}
                    materials={memodSections[selectedKey]}
                />
            </div>
        </>
    );
}
